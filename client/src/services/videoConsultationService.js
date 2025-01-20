import axios from '../utils/axios';

const API_URL = '/api/video-consultations';

// Schedule a video consultation
export const scheduleConsultation = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get available time slots for a specific date
export const getAvailableSlots = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/available-slots?date=${date}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's consultation history
export const getMyConsultations = async () => {
  try {
    const response = await axios.get(`${API_URL}/my`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reschedule a consultation
export const rescheduleConsultation = async (consultationId, scheduledDate) => {
  try {
    const response = await axios.put(`${API_URL}/${consultationId}/reschedule`, {
      scheduledDate
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cancel a consultation
export const cancelConsultation = async (consultationId, reason) => {
  try {
    const response = await axios.put(`${API_URL}/${consultationId}/cancel`, {
      reason
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
