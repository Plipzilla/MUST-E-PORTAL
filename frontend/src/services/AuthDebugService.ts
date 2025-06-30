// Debug service to test API connectivity
export class AuthDebugService {
  private static baseURL = 'http://localhost:8000/api';

  static async testConnection() {
    console.log('🧪 Testing API Connection...');
    
    try {
      // Test 1: Health check
      const healthResponse = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Health Check:', healthResponse.status, await healthResponse.text());
      
      // Test 2: Registration
      const testUser = {
        first_name: 'Debug',
        last_name: 'Test',
        email: `debug.${Date.now()}@must.ac.mw`,
        password: 'password123',
        password_confirmation: 'password123'
      };
      
      const regResponse = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser)
      });
      
      const regData = await regResponse.text();
      console.log('🧪 Registration Test:', regResponse.status, regData);
      
      // Test 3: Login
      const loginData = {
        email: 'admin@must.ac.mw',
        password: 'password'
      };
      
      const loginResponse = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      
      const loginResult = await loginResponse.text();
      console.log('🧪 Login Test:', loginResponse.status, loginResult);
      
      return {
        health: healthResponse.status,
        registration: regResponse.status,
        login: loginResponse.status
      };
      
    } catch (error) {
      console.error('❌ API Connection Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { error: errorMessage };
    }
  }
} 