import api from './api';

/**
 * Application Service
 * Handles all application (Kanban) related API calls
 */

export const applicationService = {
  /**
   * Get all applications grouped by status
   */
  async getApplications(params = {}) {
    const response = await api.get('/applications', { params });
    return response.data.data.applications;
  },

  /**
   * Get application by ID
   */
  async getApplicationById(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data.data.application;
  },

  /**
   * Update application status (move between columns)
   */
  async updateApplicationStatus(id, status, comment) {
    const response = await api.patch(`/applications/${id}/status`, {
      status,
      comment,
    });
    return response.data.data.application;
  },

  /**
   * Update application order (reorder within column)
   */
  async updateApplicationOrder(id, orderIndex) {
    const response = await api.patch(`/applications/${id}/order`, {
      orderIndex,
    });
    return response.data.data.application;
  },

  /**
   * Update application details
   */
  async updateApplication(id, data) {
    const response = await api.put(`/applications/${id}`, data);
    return response.data.data.application;
  },

  /**
   * Get application history
   */
  async getApplicationHistory(id) {
    const response = await api.get(`/applications/${id}/history`);
    return response.data.data.history;
  },
};

export default applicationService;
