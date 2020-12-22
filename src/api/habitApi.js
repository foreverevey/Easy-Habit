import axios from 'axios';
import {AsyncStorage} from 'react-native';

const instance = axios.create({
  baseURL: 'https://nnjf8umzo4.execute-api.eu-west-1.amazonaws.com/dev'
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log(token);
    return config;
  },
  (err) => {
    console.log(error.response.data);
    console.log(err);
    return Promise.reject(err);
  }
);

export default instance;
