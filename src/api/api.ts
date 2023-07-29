import { addressEndpoints } from 'api/endpoints';
import { endpoints } from 'api/index';
import axios, { AxiosPromise } from 'axios';
import { AddressCollection, Data } from 'types/api.types';

const ws = axios.create({
  baseURL: process.env.REACT_APP_DATA_BASE_URL,
  timeout: 600000,
  maxRedirects: 0
});

const addressWs = axios.create({
  baseURL: 'https://api-adresse.data.gouv.fr',
  timeout: 600000,
  maxRedirects: 0
});

export const api = {
  data: {
    area: (): AxiosPromise<Data> => ws.get(endpoints.data.area()),
    birth: (): AxiosPromise<Data> => ws.get(endpoints.data.birth()),
    birthPerCapita: (): AxiosPromise<Data> => ws.get(endpoints.data.birthPerCapita()),
    common: (): AxiosPromise<Data> => ws.get(endpoints.data.common()),
    death: (): AxiosPromise<Data> => ws.get(endpoints.data.death()),
    deathPerCapita: (): AxiosPromise<Data> => ws.get(endpoints.data.deathPerCapita()),
    density: (): AxiosPromise<Data> => ws.get(endpoints.data.density()),
    pop: (): AxiosPromise<Data> => ws.get(endpoints.data.pop()),
  },
};

export const addressApi = {
  search: (q: string): AxiosPromise<AddressCollection> => addressWs.get(addressEndpoints.search,
    { params: { limit: 15, q } })
};

export default api;
