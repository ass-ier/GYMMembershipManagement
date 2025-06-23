import { apiCall } from './config';
import { ApiResponse, PaginatedResponse, Member, CreateMemberRequest } from './types';

export const membersAPI = {
  getMembers: async (page: number = 1, pageSize: number = 10, search?: string, status?: string): Promise<ApiResponse<PaginatedResponse<Member>>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (search) params.append('search', search);
      if (status && status !== 'all') params.append('status', status);
      
      const response = await apiCall<ApiResponse<PaginatedResponse<Member>>>(
        `/members?${params.toString()}`
      );
      
      return response;
    } catch (error) {
      return {
        success: false,
        data: {
          items: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0
        },
        error: error instanceof Error ? error.message : 'Failed to get members'
      };
    }
  },

  getMember: async (id: string): Promise<ApiResponse<Member | null>> => {
    try {
      const response = await apiCall<ApiResponse<Member>>(`/members/${id}`);
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get member'
      };
    }
  },

  createMember: async (memberData: CreateMemberRequest): Promise<ApiResponse<Member>> => {
    try {
      const response = await apiCall<ApiResponse<Member>>(
        '/members',
        {
          method: 'POST',
          body: JSON.stringify(memberData),
        }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create member'
      };
    }
  },

  updateMember: async (id: string, memberData: Partial<Member>): Promise<ApiResponse<Member>> => {
    try {
      const response = await apiCall<ApiResponse<Member>>(
        `/members/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(memberData),
        }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update member'
      };
    }
  },

  deleteMember: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await apiCall<ApiResponse<boolean>>(
        `/members/${id}`,
        {
          method: 'DELETE',
        }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'Failed to delete member'
      };
    }
  },

  searchMembers: async (query: string): Promise<ApiResponse<Member[]>> => {
    try {
      const response = await apiCall<ApiResponse<Member[]>>(
        `/members/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to search members'
      };
    }
  },

  getMemberMemberships: async (id: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiCall<ApiResponse<any[]>>(`/members/${id}/memberships`);
      return response;
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to get member memberships'
      };
    }
  },

  importMembers: async (members: CreateMemberRequest[]): Promise<ApiResponse<Member[]>> => {
    try {
      // For now, create members one by one
      const importedMembers: Member[] = [];
      const errors: string[] = [];
      
      for (const memberData of members) {
        try {
          const response = await this.createMember(memberData);
          if (response.success && response.data) {
            importedMembers.push(response.data);
          } else {
            errors.push(`Failed to import ${memberData.name}: ${response.error}`);
          }
        } catch (error) {
          errors.push(`Failed to import ${memberData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      return {
        success: true,
        data: importedMembers,
        message: `${importedMembers.length} members imported successfully${errors.length > 0 ? ` (${errors.length} failed)` : ''}`
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to import members'
      };
    }
  }
};