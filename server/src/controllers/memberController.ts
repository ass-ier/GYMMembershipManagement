import { Request, Response } from 'express';
import { ApiResponse, PaginatedResponse, Member, Membership } from '@/types';
import { AuthenticatedRequest } from '@/middleware/auth';
import DatabaseConnection from '@/database/connection';
import { Helpers } from '@/utils/helpers';
import { logger } from '@/utils/logger';

export class MemberController {
  static async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, pageSize = 10, search, status, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
      const db = DatabaseConnection.getInstance();

      // Build query conditions
      const conditions: string[] = [];
      const params: any[] = [];

      if (search) {
        conditions.push('(m.name LIKE ? OR m.email LIKE ? OR m.member_number LIKE ?)');
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (status && status !== 'all') {
        conditions.push('m.status = ?');
        params.push(status);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM members m
        ${whereClause}
      `;
      const countResult = await db.get(countQuery, params);
      const total = countResult?.total || 0;

      // Get paginated results with membership info
      const offset = (Number(page) - 1) * Number(pageSize);
      const dataQuery = `
        SELECT 
          m.id, m.name, m.email, m.phone, m.emergency_contact_name as emergencyContactName,
          m.emergency_contact_phone as emergencyContactPhone, m.member_number as memberNumber,
          m.avatar, m.status, m.join_date as joinDate, m.created_at as createdAt,
          m.updated_at as updatedAt,
          ms.end_date as membershipEndDate,
          mp.name as currentPlan
        FROM members m
        LEFT JOIN memberships ms ON m.id = ms.member_id AND ms.status = 'active'
        LEFT JOIN membership_plans mp ON ms.plan_id = mp.id
        ${whereClause}
        ORDER BY m.${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
      `;

      const members = await db.all(dataQuery, [...params, Number(pageSize), offset]);

      const response: ApiResponse<PaginatedResponse<Member>> = {
        success: true,
        data: {
          items: members,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(total / Number(pageSize))
        }
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Get members failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get members'
      };
      res.status(500).json(response);
    }
  }

  static async getMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const db = DatabaseConnection.getInstance();

      const member = await db.get(`
        SELECT 
          m.id, m.name, m.email, m.phone, m.emergency_contact_name as emergencyContactName,
          m.emergency_contact_phone as emergencyContactPhone, m.member_number as memberNumber,
          m.avatar, m.status, m.join_date as joinDate, m.created_at as createdAt,
          m.updated_at as updatedAt,
          ms.id as membershipId, ms.start_date as membershipStartDate, 
          ms.end_date as membershipEndDate, ms.status as membershipStatus,
          ms.freeze_days_used as freezeDaysUsed, ms.payment_status as paymentStatus,
          mp.name as currentPlan, mp.price as planPrice, mp.freeze_days as maxFreezeDays
        FROM members m
        LEFT JOIN memberships ms ON m.id = ms.member_id AND ms.status = 'active'
        LEFT JOIN membership_plans mp ON ms.plan_id = mp.id
        WHERE m.id = ?
      `, [id]);

      if (!member) {
        const response: ApiResponse = {
          success: false,
          error: 'Member not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Member> = {
        success: true,
        data: member
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Get member failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get member'
      };
      res.status(500).json(response);
    }
  }

  static async createMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { 
        name, email, phone, emergencyContactName, emergencyContactPhone, 
        planId, paymentMethod, discount = 0 
      } = req.body;
      const db = DatabaseConnection.getInstance();

      // Check if email already exists
      const existingMember = await db.get(
        'SELECT id FROM members WHERE email = ?',
        [email]
      );

      if (existingMember) {
        const response: ApiResponse = {
          success: false,
          error: 'Member with this email already exists'
        };
        res.status(409).json(response);
        return;
      }

      // Get plan details
      const plan = await db.get(
        'SELECT * FROM membership_plans WHERE id = ? AND is_active = 1',
        [planId]
      );

      if (!plan) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid membership plan'
        };
        res.status(400).json(response);
        return;
      }

      // Generate member data
      const memberId = Helpers.generateId();
      const memberNumber = Helpers.generateMemberNumber();
      const joinDate = new Date();
      const membershipId = Helpers.generateId();
      const startDate = joinDate;
      const endDate = Helpers.calculateMembershipEndDate(startDate, plan.duration);

      // Calculate payment amount
      const finalAmount = Helpers.calculateFinalAmount(plan.price, discount);

      // Create member
      await db.run(`
        INSERT INTO members (
          id, name, email, phone, emergency_contact_name, emergency_contact_phone,
          member_number, join_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        memberId, name, email, phone, emergencyContactName, 
        emergencyContactPhone, memberNumber, Helpers.formatDate(joinDate)
      ]);

      // Create membership
      await db.run(`
        INSERT INTO memberships (
          id, member_id, plan_id, start_date, end_date, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        membershipId, memberId, planId, 
        Helpers.formatDate(startDate), Helpers.formatDate(endDate), 'paid'
      ]);

      // Create payment record
      const paymentId = Helpers.generateId();
      await db.run(`
        INSERT INTO payments (
          id, member_id, membership_id, amount, method, status, processed_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        paymentId, memberId, membershipId, finalAmount, 
        paymentMethod, 'completed', req.user!.userId
      ]);

      // Get created member with membership info
      const createdMember = await db.get(`
        SELECT 
          m.id, m.name, m.email, m.phone, m.emergency_contact_name as emergencyContactName,
          m.emergency_contact_phone as emergencyContactPhone, m.member_number as memberNumber,
          m.avatar, m.status, m.join_date as joinDate, m.created_at as createdAt,
          ms.end_date as membershipEndDate,
          mp.name as currentPlan
        FROM members m
        LEFT JOIN memberships ms ON m.id = ms.member_id AND ms.status = 'active'
        LEFT JOIN membership_plans mp ON ms.plan_id = mp.id
        WHERE m.id = ?
      `, [memberId]);

      logger.info('Member created successfully', { 
        memberId, memberNumber, email, planId, amount: finalAmount 
      });

      const response: ApiResponse<Member> = {
        success: true,
        data: createdMember,
        message: 'Member created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Create member failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create member'
      };
      res.status(500).json(response);
    }
  }

  static async updateMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, phone, emergencyContactName, emergencyContactPhone, status } = req.body;
      const db = DatabaseConnection.getInstance();

      // Check if member exists
      const existingMember = await db.get('SELECT id FROM members WHERE id = ?', [id]);
      if (!existingMember) {
        const response: ApiResponse = {
          success: false,
          error: 'Member not found'
        };
        res.status(404).json(response);
        return;
      }

      // Check if email is taken by another member
      if (email) {
        const emailTaken = await db.get(
          'SELECT id FROM members WHERE email = ? AND id != ?',
          [email, id]
        );

        if (emailTaken) {
          const response: ApiResponse = {
            success: false,
            error: 'Email is already taken'
          };
          res.status(409).json(response);
          return;
        }
      }

      // Build update query
      const updates: string[] = [];
      const values: any[] = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }

      if (email) {
        updates.push('email = ?');
        values.push(email);
      }

      if (phone) {
        updates.push('phone = ?');
        values.push(phone);
      }

      if (emergencyContactName !== undefined) {
        updates.push('emergency_contact_name = ?');
        values.push(emergencyContactName);
      }

      if (emergencyContactPhone !== undefined) {
        updates.push('emergency_contact_phone = ?');
        values.push(emergencyContactPhone);
      }

      if (status) {
        updates.push('status = ?');
        values.push(status);
      }

      if (updates.length > 0) {
        values.push(id);
        await db.run(
          `UPDATE members SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }

      // Get updated member
      const updatedMember = await db.get(`
        SELECT 
          m.id, m.name, m.email, m.phone, m.emergency_contact_name as emergencyContactName,
          m.emergency_contact_phone as emergencyContactPhone, m.member_number as memberNumber,
          m.avatar, m.status, m.join_date as joinDate, m.created_at as createdAt,
          m.updated_at as updatedAt,
          ms.end_date as membershipEndDate,
          mp.name as currentPlan
        FROM members m
        LEFT JOIN memberships ms ON m.id = ms.member_id AND ms.status = 'active'
        LEFT JOIN membership_plans mp ON ms.plan_id = mp.id
        WHERE m.id = ?
      `, [id]);

      logger.info('Member updated successfully', { memberId: id });

      const response: ApiResponse<Member> = {
        success: true,
        data: updatedMember,
        message: 'Member updated successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Update member failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update member'
      };
      res.status(500).json(response);
    }
  }

  static async deleteMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const db = DatabaseConnection.getInstance();

      // Check if member exists
      const member = await db.get('SELECT id FROM members WHERE id = ?', [id]);
      if (!member) {
        const response: ApiResponse = {
          success: false,
          error: 'Member not found'
        };
        res.status(404).json(response);
        return;
      }

      // Delete member (cascade will handle related records)
      await db.run('DELETE FROM members WHERE id = ?', [id]);

      logger.info('Member deleted successfully', { memberId: id });

      const response: ApiResponse = {
        success: true,
        message: 'Member deleted successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Delete member failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete member'
      };
      res.status(500).json(response);
    }
  }

  static async getMemberMemberships(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const db = DatabaseConnection.getInstance();

      const memberships = await db.all(`
        SELECT 
          ms.id, ms.start_date as startDate, ms.end_date as endDate,
          ms.status, ms.freeze_days_used as freezeDaysUsed, ms.payment_status as paymentStatus,
          ms.created_at as createdAt, ms.updated_at as updatedAt,
          mp.name as planName, mp.duration, mp.price, mp.freeze_days as maxFreezeDays
        FROM memberships ms
        JOIN membership_plans mp ON ms.plan_id = mp.id
        WHERE ms.member_id = ?
        ORDER BY ms.created_at DESC
      `, [id]);

      const response: ApiResponse<Membership[]> = {
        success: true,
        data: memberships
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Get member memberships failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get member memberships'
      };
      res.status(500).json(response);
    }
  }

  static async searchMembers(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        const response: ApiResponse = {
          success: false,
          error: 'Search query must be at least 2 characters'
        };
        res.status(400).json(response);
        return;
      }

      const db = DatabaseConnection.getInstance();
      const searchTerm = `%${q.trim()}%`;

      const members = await db.all(`
        SELECT 
          m.id, m.name, m.email, m.member_number as memberNumber, m.status,
          mp.name as currentPlan
        FROM members m
        LEFT JOIN memberships ms ON m.id = ms.member_id AND ms.status = 'active'
        LEFT JOIN membership_plans mp ON ms.plan_id = mp.id
        WHERE m.name LIKE ? OR m.email LIKE ? OR m.member_number LIKE ?
        ORDER BY m.name
        LIMIT 20
      `, [searchTerm, searchTerm, searchTerm]);

      const response: ApiResponse<Member[]> = {
        success: true,
        data: members
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Search members failed', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to search members'
      };
      res.status(500).json(response);
    }
  }
}