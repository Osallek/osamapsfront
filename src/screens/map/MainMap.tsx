import { LngLat, MapboxGeoJSONFeature } from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { useEffect, useState } from 'react';
import { Map, MapLayerMouseEvent, Popup } from 'react-map-gl';
import { mapStyle } from 'screens/map/map-style';
import DataPopup from 'screens/popup/DataPopup';
import { Commune, Data, Departement, Region } from 'types/api.types';

interface MapPageProps {
  data?: Data;
}

function MapPage({ data }: MapPageProps) {
  const [hover, setHover] = useState<MapboxGeoJSONFeature | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [clicked, setClicked] = useState<MapboxGeoJSONFeature | undefined>(undefined);
  const [position, setPosition] = useState<LngLat | undefined>(undefined);
  const [activeData, setActiveData] = useState<Commune | Departement | Region | undefined>(undefined);

  const onMouseMove = (event: MapLayerMouseEvent) => {
    if (!loaded) {
      return;
    }

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

    if (hover && selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0] === hover) {
      return;
    }

    if (hover) {
      event.target.setFeatureState(hover, { hover: false });
    }

    if (selectedFeatures && selectedFeatures.length > 0) {
      event.target.setFeatureState(selectedFeatures[0], { hover: true });

      setHover(selectedFeatures[0]);
    } else {
      setHover(undefined);
    }
  };

  const onClick = (event: MapLayerMouseEvent) => {
    if (!loaded) {
      return;
    }

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

    if (selectedFeatures.length === 0) {
      setClicked(undefined);
    } else {
      if (clicked && selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0] === clicked) {
        return;
      }

      if (selectedFeatures[0].id) {
        setClicked(selectedFeatures[0]);
        setPosition(event.lngLat);
      } else {
        setClicked(undefined);
      }
    }
  };

  useEffect(() => {
    if (clicked && clicked.id && data) {
      switch (clicked.layer.id) {
        case 'region': {
          if (data.regions[clicked.id]) {
            setActiveData(data.regions[clicked.id]);
          } else {
            console.log('No region');
          }
          break;
        }
        case 'departement': {
          if (data.departements[clicked.id]) {
            setActiveData(data.departements[clicked.id]);
          } else {
            console.log('No departement');
          }
          break;
        }
        case 'commune': {
          if (data.communes[clicked.id]) {
            setActiveData(data.communes[clicked.id]);
          } else {
            console.log('No commune');
          }
          break;
        }
      }
    } else {
      setPosition(undefined);
      setActiveData(undefined);
    }
  }, [clicked, data]);

  return (
    <Map id="main"
         mapLib={ maplibregl }
         style={ { height: '100%' } }
         mapStyle={ mapStyle }
         maxZoom={ 18 }
         minZoom={ 6 }
         maxBounds={ [[-10, 41.2], [15, 51.45]] }
         initialViewState={ { zoom: 11, latitude: 48.925239263078566, longitude: 2.183056484769497 } }
         renderWorldCopies={ true }
         onMouseMove={ onMouseMove }
         onClick={ onClick }
         onLoad={ () => setLoaded(true) }
         onZoomStart={ e => setClicked(undefined) }
    >
      { position && activeData && (
        <Popup longitude={ position.lng } latitude={ position.lat } anchor="bottom" closeOnMove={ false }
               closeOnClick={ false } closeButton={ false } onClose={ e => setClicked(undefined) }>
          <DataPopup data={ activeData } onClose={ () => setClicked(undefined) }/>
        </Popup>) }
    </Map>
  );
}

export default MapPage;

