import apiClient from './api.service';

const applicationService = {
  // Submit application
  submitApplication: async (applicationData) => {
    const response = await apiClient.post('/applications', applicationData);
    return response.data;
  },

  // Get my application status
  getMyStatus: async () => {
    const response = await apiClient.get('/applications/my-status');
    return response.data;
  },

  // Get all applications (Admin)
  getAllApplications: async (status = null) => {
    const url = status ? `/applications?status=${status}` : '/applications';
    const response = await apiClient.get(url);
    return response.data;
  },

  // Approve application (Admin)
  approveApplication: async (applicationId) => {
    const response = await apiClient.put(`/applications/${applicationId}/approve`);
    return response.data;
  },

  // Reject application (Admin)
  rejectApplication: async (applicationId, reason) => {
    const response = await apiClient.put(`/applications/${applicationId}/reject`, { reason });
    return response.data;
  }
};

export default applicationService;
