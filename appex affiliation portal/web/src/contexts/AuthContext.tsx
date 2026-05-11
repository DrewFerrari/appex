import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User, Session, LoginCredentials, RegisterData, MfaVerificationData, ApiResponse } from '../types/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  verifyMfa: (data: MfaVerificationData) => Promise<void>
  clearError: () => void
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; session: Session } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'MFA_REQUIRED'; payload: { mfaSessionId: string; availableMethods: string[] } }
  | { type: 'MFA_SUCCESS'; payload: { user: User; session: Session } }
  | { type: 'MFA_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: AuthContextType = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  verifyMfa: async () => {},
  clearError: () => {}
}

const authReducer = (state: AuthContextType, action: AuthAction): AuthContextType => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
        error: null
      }
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        session: null,
        isLoading: false,
        error: action.payload
      }
    
    case 'MFA_REQUIRED':
      return {
        ...state,
        isLoading: false,
        error: null
      }
    
    case 'MFA_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
        error: null
      }
    
    case 'MFA_FAILURE':
      return {
        ...state,
        user: null,
        session: null,
        isLoading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        session: null,
        isLoading: false,
        error: null
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })
      
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        if (data.requiresMfa) {
          dispatch({ 
            type: 'MFA_REQUIRED', 
            payload: {
              mfaSessionId: data.mfaSessionId,
              availableMethods: data.availableMethods
            }
          })
        } else {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: {
              user: data.user,
              session: data.session
            }
          })
        }
      } else {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: data.message || 'Login failed' 
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Network error occurred' 
      })
    }
  }

  const verifyMfa = async (data: MfaVerificationData) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-mfa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      })
      
      const result: ApiResponse = await response.json()
      
      if (result.success) {
        dispatch({ 
          type: 'MFA_SUCCESS', 
          payload: {
            user: result.user,
            session: result.session
          }
        })
      } else {
        dispatch({ 
          type: 'MFA_FAILURE', 
          payload: result.message || 'MFA verification failed' 
        })
      }
    } catch (error) {
      console.error('MFA verification error:', error)
      dispatch({ 
        type: 'MFA_FAILURE', 
        payload: 'Network error occurred' 
      })
    }
  }

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const initializeAuth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include'
      })
      
      const data: ApiResponse = await response.json()
      
      if (data.success && data.user) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: {
            user: data.user,
            session: data.session
          }
        })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
    }
  }

  const value: AuthContextType = {
    user: state.user,
    session: state.session,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    verifyMfa,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
