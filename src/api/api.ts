import { endpoints } from 'api/index';
import axios, { AxiosPromise } from 'axios';
import { Data } from 'types/api.types';

const ws = axios.create({
  baseURL: process.env.REACT_APP_DATA_BASE_URL,
  timeout: 600000,
  maxRedirects: 0,
});

const api = {
  data: {
    get: (): AxiosPromise<Data> => ws.get(endpoints.data.data()),
  },
};

export default api;
