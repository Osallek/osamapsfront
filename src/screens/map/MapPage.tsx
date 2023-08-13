import { Backdrop, CircularProgress, Grid } from '@mui/material';
import { api } from 'api';
import { createContext, useEffect, useState } from 'react';
import { MapProvider } from 'react-map-gl';
import MainMap from 'screens/map/MainMap';
import MapMenu from 'screens/MapMenu/MapMenu';
import { Api } from 'types/api.types';

export const DataContext = createContext<Api | undefined>(undefined);

function MapPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Api | undefined>(undefined);

  useEffect(() => {
    ;(async () => {
      try {
        const start = new Date();
        const common = api.data.common();
        const pop = api.jenks.pop();
        const density = api.jenks.density();
        const deathPerCapita = api.jenks.deathPerCapita();
        const birthPerCapita = api.jenks.birthPerCapita();
        const death = api.jenks.death();
        const birth = api.jenks.birth();
        const area = api.jenks.area();

        const d: Api = {
          common: (await common).data,
          jenks: {
            population: (await pop).data,
            density: (await density).data,
            deathPerCapita: (await deathPerCapita).data,
            birthPerCapita: (await birthPerCapita).data,
            death: (await death).data,
            birth: (await birth).data,
            area: (await area).data,
          },
          regions: {},
          departements: {},
          communes: {}
        };

        console.log('fetched: ' + (new Date().getTime() - start.getTime()) + 'ms');
        setData(d);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Grid sx={ { height: '100%' } }>
      <Backdrop open={ loading } sx={ { zIndex: 1 } }>
        <CircularProgress color="primary" size={ 45 }/>
      </Backdrop>
      <MapProvider>
        <DataContext.Provider value={ data }>
          {
            data && (
              <>
                <MapMenu data={ data }/>
                <MainMap data={ data }/>
              </>
            )
          }
        </DataContext.Provider>
      </MapProvider>
    </Grid>
  );
}

export default MapPage;

