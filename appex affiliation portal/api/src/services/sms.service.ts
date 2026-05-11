import fetch from 'node-fetch'

export class SMSService {
  private static readonly API_URL = 'https://api.africastalking.com/version1'
  private static readonly USERNAME = process.env.AFRICASTALKING_USERNAME!
  private static readonly API_KEY = process.env.AFRICASTALKING_API_KEY!
  private static readonly SENDER_ID = process.env.AFRICASTALKING_SENDER_ID || 'AppEx'

  static async sendVerificationSMS(phone: string, otp: string, fullName: string): Promise<void> {
    try {
      const message = `Hi ${fullName}, your AppEx verification code is: ${otp}. This code expires in 15 minutes.`
      
      const response = await fetch(`${this.API_URL}/messaging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: this.USERNAME,
          to: phone,
          message,
          from: this.SENDER_ID
        })
      })

      const result = await response.json()
      
      if (!result.SMSMessageData || result.SMSMessageData.Message !== 'Sent') {
        throw new Error('Failed to send SMS')
      }
      
      console.log(`SMS sent to ${phone}: ${otp}`)
    } catch (error) {
      console.error('SMS sending error:', error)
      throw error
    }
  }

  static async sendSecurityAlert(phone: string, message: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/messaging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: this.USERNAME,
          to: phone,
          message,
          from: this.SENDER_ID
        })
      })

      const result = await response.json()
      
      if (!result.SMSMessageData || result.SMSMessageData.Message !== 'Sent') {
        throw new Error('Failed to send security alert SMS')
      }
      
      console.log(`Security alert SMS sent to ${phone}`)
    } catch (error) {
      console.error('Security SMS sending error:', error)
      throw error
    }
  }

  static async sendWelcomeSMS(phone: string, fullName: string): Promise<void> {
    try {
      const message = `Welcome to AppEx Affiliation Portal, ${fullName}! Your account has been successfully created. Start earning commissions today!`
      
      const response = await fetch(`${this.API_URL}/messaging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: this.USERNAME,
          to: phone,
          message,
          from: this.SENDER_ID
        })
      })

      const result = await response.json()
      
      if (!result.SMSMessageData || result.SMSMessageData.Message !== 'Sent') {
        throw new Error('Failed to send welcome SMS')
      }
      
      console.log(`Welcome SMS sent to ${phone}`)
    } catch (error) {
      console.error('Welcome SMS sending error:', error)
      throw error
    }
  }

  static validatePhoneNumber(phone: string): boolean {
    // Zimbabwe phone number validation
    const zimbabwePhoneRegex = /^(077|071|078|079)\d{7}$/
    return zimbabwePhoneRegex.test(phone)
  }

  static formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    // Ensure it starts with Zimbabwe country code if needed
    if (digits.startsWith('263')) {
      return digits
    }
    
    // If it's a local number (starts with 07), add country code
    if (digits.startsWith('07')) {
      return `263${digits.slice(1)}`
    }
    
    return digits
  }
}
