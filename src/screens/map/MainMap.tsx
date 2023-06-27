import { Grid } from '@mui/material';
import frCities from 'data/fr/0.json';
import maplibregl from 'maplibre-gl';
import { Layer, Map, MapProvider, Source, ViewStateChangeEvent } from 'react-map-gl';
import { dataLayer } from 'screens/map/geojson-style';
import { mapStyle } from 'screens/map/map-style';

const frCitiesGeo = frCities as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

function MainMap() {
  const onMove = (event: ViewStateChangeEvent) => {
    console.log(event.target.getBounds().getEast());
  };

  return (
    <Grid sx={ { height: '100%' } }>
      <MapProvider>
        <Map id="main"
             mapLib={ maplibregl }
             style={ { height: '100%' } }
             mapStyle={ mapStyle }
             maxZoom={ 16 }
             maxBounds={ [[-180, -85], [179.999999, 85]] }
             initialViewState={ { zoom: 8, latitude: 49, longitude: 3 } }
             renderWorldCopies={ true }
             onMove={ onMove }
        >
          <Source type="geojson" data={ frCitiesGeo }>
            <Layer { ...dataLayer } />
          </Source>
        </Map>
      </MapProvider>
    </Grid>
  );
}

export default MainMap;

