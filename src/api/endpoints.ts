export const endpoints = {
  data: {
    common: () => `/data/common.json`,
    region: (id: string) => `/data/regions/${ id }.json`,
    departement: (id: string) => `/data/departements/${ id }.json`,
    commune: (id: string) => `/data/communes/${ id }.json`,
  },
  jenks: {
    area: () => `/data/jenks/area.json`,
    birth: () => `/data/jenks/birth.json`,
    birthPerCapita: () => `/data/jenks/birth-per-capita.json`,
    death: () => `/data/jenks/death.json`,
    deathPerCapita: () => `/data/jenks/death-per-capita.json`,
    density: () => `/data/jenks/density.json`,
    pop: () => `/data/jenks/population.json`,
  },
};

export const addressEndpoints = {
  search: '/search'
};

export default endpoints;
