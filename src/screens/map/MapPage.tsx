import { Backdrop, CircularProgress, Grid } from '@mui/material';
import { api } from 'api';
import { createContext, useEffect, useState } from 'react';
import { MapProvider } from 'react-map-gl';
import MainMap from 'screens/map/MainMap';
import MapMenu from 'screens/MapMenu/MapMenu';
import { Data } from 'types/api.types';

export const DataContext = createContext<Data | undefined>(undefined);

function MapPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data | undefined>(undefined);

  useEffect(() => {
    ;(async () => {
      const { data } = await api.data.get();
      setData(data);

      setLoading(false);
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

