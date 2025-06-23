import { v4 as uuidv4 } from 'uuid';
import { addMonths, format } from 'date-fns';

export class Helpers {
  static generateId(): string {
    return uuidv4();
  }

  static generateMemberNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FT${timestamp.slice(-6)}${random}`;
  }

  static calculateMembershipEndDate(startDate: Date, durationMonths: number): Date {
    return addMonths(startDate, durationMonths);
  }

  static formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  static formatDateTime(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static calculateDiscount(amount: number, discountPercent: number): number {
    return Math.round((amount * discountPercent) / 100 * 100) / 100;
  }

  static calculateFinalAmount(amount: number, discountPercent: number): number {
    const discount = this.calculateDiscount(amount, discountPercent);
    return amount - discount;
  }

  static isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  static parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    if (typeof value === 'number') {
      return value === 1;
    }
    return false;
  }

  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}