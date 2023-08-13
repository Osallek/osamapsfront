import { api } from 'api';
import { Api } from 'types/api.types';

export async function fetchRegion(data: Api, id: string): Promise<void> {
  if (!data.regions || !data.regions[id]) {
    const { data: region } = await api.data.region(id);

    data.regions[region.id] = region;
  }

  if (!data.communes || !data.communes[data.regions[id].chefLieu]) {
    await fetchCommune(data, data.regions[id].chefLieu);
  }
}

export async function fetchDepartement(data: Api, id: string): Promise<void> {
  if (!data.departements || !data.departements[id]) {
    const { data: departement } = await api.data.departement(id);

    data.departements[departement.id] = departement;
  }

  if (!data.regions || !data.regions[data.departements[id].region]) {
    await fetchRegion(data, data.departements[id].region);
  }

  if (!data.communes || !data.communes[data.departements[id].chefLieu]) {
    await fetchCommune(data, data.departements[id].chefLieu);
  }
}

export async function fetchCommune(data: Api, id: string): Promise<void> {
  if (!data.communes || !data.communes[id]) {
    const { data: commune } = await api.data.commune(id);

    data.communes[commune.id] = commune;
  }

  if (!data.departements || !data.departements[data.communes[id].departement]) {
    await fetchDepartement(data, data.communes[id].departement);
  }

  if (!data.regions || !data.regions[data.departements[data.communes[id].departement].region]) {
    await fetchRegion(data, data.departements[data.communes[id].departement].region);
  }
}
