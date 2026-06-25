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
    const appsGrouped = response.data.data.applications;

    const flatApps = [];
    if (appsGrouped) {
      if (Array.isArray(appsGrouped)) {
        flatApps.push(...appsGrouped);
      } else {
        Object.values(appsGrouped).forEach(list => {
          if (Array.isArray(list)) {
            flatApps.push(...list);
          }
        });
      }
    }

    return flatApps.map(app => ({
      ...app,
      firstName: app.employee?.first_name || '',
      lastName: app.employee?.last_name || '',
      phone: app.employee?.phone || '',
      createdAt: app.created_at,
      experience: app.employee?.experience || 0,
      address: app.employee?.address || '',
      assignedTo: app.assigned_to?.id || app.assigned_to || '',
    }));
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
