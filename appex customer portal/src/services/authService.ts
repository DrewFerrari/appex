import api from './api'
import type { User, LoginFormData, ApiResponse } from '@/types'

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    return response.data.data
  },

  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
    businessName: string
    businessType: string
  }): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', userData)
    return response.data.data
  },

  async refreshToken(token: string): Promise<{ token: string }> {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh', { token })
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async verify2FA(code: string): Promise<{ verified: boolean }> {
    const response = await api.post<ApiResponse<{ verified: boolean }>>('/auth/verify-2fa', { code })
    return response.data.data
  },

  async enable2FA(): Promise<{ qrCode: string; backupCodes: string[] }> {
    const response = await api.post<ApiResponse<{ qrCode: string; backupCodes: string[] }>>('/auth/enable-2fa')
    return response.data.data
  },

  async resetPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', { email })
    return response.data.data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data.data
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData)
    return response.data.data
  },

  async verifyPhone(phone: string, code: string): Promise<{ verified: boolean }> {
    const response = await api.post<ApiResponse<{ verified: boolean }>>('/auth/verify-phone', {
      phone,
      code,
    })
    return response.data.data
  },

  async sendPhoneVerification(phone: string): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/send-phone-verification', {
      phone,
    })
    return response.data.data
  },
}
