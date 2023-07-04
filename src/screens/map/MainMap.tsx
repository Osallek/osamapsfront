import { Grid } from '@mui/material';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { useRef, useState } from 'react';
import { Map, MapLayerMouseEvent, MapProvider, ViewStateChangeEvent } from 'react-map-gl';
import { mapStyle } from 'screens/map/map-style';

function MainMap() {
  const [hover, setHover] = useState<Array<MapboxGeoJSONFeature> | undefined>(undefined);
  const mapRef = useRef<any>();

  const onMove = (event: ViewStateChangeEvent) => {
  };

  const onMouseMove = (event: MapLayerMouseEvent) => {
    let selectedFeatures = event.target.queryRenderedFeatures([event.point.x, event.point.y], {
      layers: ['commune']
    });

    if (selectedFeatures.length === 0) {
      selectedFeatures = event.target.queryRenderedFeatures([event.point.x, event.point.y], {
        layers: ['departement']
      });
    }

    if (selectedFeatures.length === 0) {
      selectedFeatures = event.target.queryRenderedFeatures([event.point.x, event.point.y], {
        layers: ['region']
      });
    }

    if (hover) {
      for (const feature of hover) {
        event.target.setFeatureState(feature, { hover: false });
      }
    }

    if (selectedFeatures && selectedFeatures.length > 0) {
      for (const feature of selectedFeatures) {
        event.target.setFeatureState(feature, { hover: true });
      }
    }

    setHover(selectedFeatures.length > 0 ? selectedFeatures : undefined);
  };

  const onClick = (event: MapLayerMouseEvent) => {
    const selectedFeatures = event.target.queryRenderedFeatures([event.point.x, event.point.y], {
      layers: ['commune', 'departement', 'region']
    });
  };

  return (
    <Grid sx={ { height: '100%' } }>
      <MapProvider>
        <Map id="main"
             ref={ mapRef }
             mapLib={ maplibregl }
             style={ { height: '100%' } }
             mapStyle={ mapStyle }
             maxZoom={ 18 }
             minZoom={ 6 }
             maxBounds={ [[-10, 41.2], [15, 51.45]] }
             initialViewState={ { zoom: 3, latitude: 48.861649992838935, longitude: 2.3406993635478157 } }
             renderWorldCopies={ true }
             onMove={ onMove }
             onMouseMove={ onMouseMove }
             onClick={ onClick }
        >
        </Map>
      </MapProvider>
    </Grid>
  );
}

export default MainMap;

