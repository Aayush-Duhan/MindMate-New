import axios from '../utils/axios';

const API_URL = '/api/phone-consultations';

// Request a phone consultation
export const requestConsultation = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
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

// Cancel a consultation
export const cancelConsultation = async (consultationId) => {
  try {
    const response = await axios.delete(`${API_URL}/${consultationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
