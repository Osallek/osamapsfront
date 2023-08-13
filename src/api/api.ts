import { addressEndpoints } from 'api/endpoints';
import { endpoints } from 'api/index';
import axios, { AxiosPromise } from 'axios';
import { AddressCollection, Common, Commune, DataJenksNode, Departement, Region } from 'types/api.types';

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
    common: (): AxiosPromise<Common> => ws.get(endpoints.data.common()),
    region: (id: string): AxiosPromise<Region> => ws.get(endpoints.data.region(id)),
    departement: (id: string): AxiosPromise<Departement> => ws.get(endpoints.data.departement(id)),
    commune: (id: string): AxiosPromise<Commune> => ws.get(endpoints.data.commune(id)),
  },
  jenks: {
    area: (): AxiosPromise<DataJenksNode> => ws.get(endpoints.jenks.area()),
    birth: (): AxiosPromise<Record<number, DataJenksNode>> => ws.get(endpoints.jenks.birth()),
    birthPerCapita: (): AxiosPromise<Record<number, DataJenksNode>> => ws.get(endpoints.jenks.birthPerCapita()),
    death: (): AxiosPromise<Record<number, DataJenksNode>> => ws.get(endpoints.jenks.death()),
    deathPerCapita: (): AxiosPromise<Record<number, DataJenksNode>> => ws.get(endpoints.jenks.deathPerCapita()),
    density: (): AxiosPromise<Record<number, DataJenksNode>> => ws.get(endpoints.jenks.density()),
    pop: (): AxiosPromise<Record<number, DataJenksNode>> => ws.get(endpoints.jenks.pop()),
  },
};

export const addressApi = {
  search: (q: string): AxiosPromise<AddressCollection> => addressWs.get(addressEndpoints.search,
    { params: { limit: 15, q } })
};

export default api;
