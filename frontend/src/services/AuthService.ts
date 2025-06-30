import axios, { AxiosResponse } from 'axios';
import { history } from './history';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = false; // Laravel Passport doesn't need cookies
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor to add auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear tokens 
      // Use history helper for navigation (no page refresh!)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Navigate using history helper if available
      if (history.navigate) {
        console.log('🔄 AUTH SERVICE - 401 error, redirecting to login');
        history.navigate('/login', { replace: true });
      } else {
        console.warn('🔄 AUTH SERVICE - History.navigate not available, falling back to location');
        // Fallback for very early requests before history is initialized
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  email_verified_at: string | null;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  provider?: string;
  provider_id?: string;
  avatar?: string;
  last_activity?: string;
  session_timeout?: number;
  roles?: any[];
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    console.log('🔍 AUTH DEBUG - hasRole called with:', role);
    console.log('🔍 AUTH DEBUG - Current user:', user);
    console.log('🔍 AUTH DEBUG - User roles:', user?.roles);
    
    if (!user?.roles) {
      console.log('🔍 AUTH DEBUG - No roles found, returning false');
      return false;
    }
    
    const hasRole = user.roles.some((userRole: any) => 
      userRole.name === role || userRole === role
    );
    console.log('🔍 AUTH DEBUG - hasRole result:', hasRole);
    return hasRole;
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  // Check if user is admin
  isAdmin(): boolean {
    console.log('🔍 AUTH DEBUG - isAdmin() called');
    const result = this.hasRole('admin');
    console.log('🔍 AUTH DEBUG - isAdmin() result:', result);
    return result;
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Refresh user data
  async refreshUser(): Promise<User> {
    try {
      const response: AxiosResponse<{ success: boolean; user: User }> = await axios.get('/auth/user');
      
      if (response.data.success) {
        const { user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to refresh user data');
    }
  }

  // Check authentication status
  async checkAuth(): Promise<User | null> {
    try {
      const response: AxiosResponse<{ success: boolean; user: User; authenticated: boolean }> = await axios.get('/auth/check');
      
      if (response.data.success && response.data.authenticated) {
        const { user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        // Not authenticated, clear local storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        return null;
      }
    } catch (error: any) {
      // Error checking auth, clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    }
  }

  // Google OAuth login
  async loginWithGoogle(): Promise<void> {
    // DON'T use window.location.href - it causes page refresh!
    // For OAuth, we need to open in new window/tab to avoid refresh
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    
    window.open(
      'http://localhost:8000/api/auth/google',
      'GoogleAuth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  // Facebook OAuth login
  async loginWithFacebook(): Promise<void> {
    // DON'T use window.location.href - it causes page refresh!
    // For OAuth, we need to open in new window/tab to avoid refresh
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    
    window.open(
      'http://localhost:8000/api/auth/facebook',
      'FacebookAuth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  // Handle OAuth callback
  async handleOAuthCallback(token: string): Promise<User> {
    try {
      // Store the token
      localStorage.setItem('auth_token', token);
      
      // Get user data
      const user = await this.refreshUser();
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'OAuth callback failed');
    }
  }
}

export default new AuthService(); 