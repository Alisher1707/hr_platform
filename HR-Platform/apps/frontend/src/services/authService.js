import api from './api';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */

const mapUser = (user) => {
  if (!user) return user;
  return {
    ...user,
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
  };
};

export const authService = {
  /**
   * Login user
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user } = response.data.data;

    // Store token
    localStorage.setItem('accessToken', accessToken);

    return { user: mapUser(user), accessToken };
  },

  /**
   * Register user with invite token
   */
  async register(data) {
    const response = await api.post('/auth/register', data);
    const { accessToken, user } = response.data.data;

    // Store token
    localStorage.setItem('accessToken', accessToken);

    return { user: mapUser(user), accessToken };
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return mapUser(response.data.data.user);
  },

  /**
   * Validate invite token
   */
  async validateInviteToken(token) {
    const response = await api.get(`/invites/validate/${token}`);
    return response.data.data;
  },
};

export default authService;
