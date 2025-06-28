import axios, { AxiosResponse } from 'axios';

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
      // Token expired or invalid, clear tokens and redirect
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
    if (!user?.roles) return false;
    return user.roles.some((userRole: any) => 
      userRole.name === role || userRole === role
    );
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if user is reviewer
  isReviewer(): boolean {
    return this.hasRole('reviewer');
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
    window.location.href = 'http://localhost:8000/api/auth/google';
  }

  // Facebook OAuth login
  async loginWithFacebook(): Promise<void> {
    window.location.href = 'http://localhost:8000/api/auth/facebook';
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