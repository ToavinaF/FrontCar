// ApiCall.jsx
import axios from 'axios';

export const ApiCall = async (url, method, data = null, config = {}) => {
  try {
    const response = await axios({
      url,
      method,
      data: method === 'DELETE' ? undefined : data,
      params: method === 'DELETE' ? data : undefined,
      ...config,
    });
    return response;
  } catch (error) {
    console.error('Erreur dans ApiCall:', error);
    throw error;
  }
};


