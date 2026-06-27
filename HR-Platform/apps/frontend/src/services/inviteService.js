import api from './api';

/**
 * Invite Service
 * Handles invite-related API calls
 */
export const inviteService = {
  /**
   * Create invite link
   */
  async createInvite(data = {}) {
    const response = await api.post('/invites', data);
    return response.data.data.invite;
  },

  /**
   * Get all invites
   */
  async getInvites(params = {}) {
    const response = await api.get('/invites', { params });
    return response.data.data.invites;
  },

  /**
   * Get invite by ID
   */
  async getInviteById(id) {
    const response = await api.get(`/invites/${id}`);
    return response.data.data.invite;
  },

  /**
   * Deactivate invite link
   */
  async deactivateInvite(id) {
    const response = await api.patch(`/invites/${id}/deactivate`);
    return response.data.data;
  },

  /**
   * Delete invite link
   */
  async deleteInvite(id) {
    const response = await api.delete(`/invites/${id}`);
    return response.data.data;
  },

  /**
   * Submit application using invite token
   */
  async submitApplication(data) {
    const response = await api.post('/invites/apply', data);
    return response.data.data;
  },
};

export default inviteService;
