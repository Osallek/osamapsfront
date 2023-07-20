import { Dialog } from '@mui/material';
import { LngLat, MapboxGeoJSONFeature, MapSourceDataEvent } from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { Map, MapLayerMouseEvent, MapRef, Popup } from 'react-map-gl';
import DataDialog from 'screens/dialog/DataDialog';
import { mapStyle } from 'screens/map/map-style';
import DataPopup from 'screens/popup/DataPopup';
import { Commune, Data, Departement, Level, Region } from 'types/api.types';
import { DataView, MapsLayers } from 'types/maps.types';
import { flatten } from 'utils/object.utils';

interface MapPageProps {
  data: Data;
}

function MapPage({ data }: MapPageProps) {
  const [hover, setHover] = useState<MapboxGeoJSONFeature | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [clicked, setClicked] = useState<MapboxGeoJSONFeature | undefined>(undefined);
  const [position, setPosition] = useState<LngLat | undefined>(undefined);
  const [activeData, setActiveData] = useState<Commune | Departement | Region | undefined>(undefined);
  const [dialog, setDialog] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);

  const onMouseMove = (e: MapLayerMouseEvent) => {
    if (!loaded) {
      return;
    }

    let selectedFeatures = e.target.queryRenderedFeatures([e.point.x, e.point.y], {
      layers: [MapsLayers.COMMUNE]
    });

    if (selectedFeatures.length === 0) {
      selectedFeatures = e.target.queryRenderedFeatures([e.point.x, e.point.y], {
        layers: [MapsLayers.DEPARTEMENT]
      });
    }

    if (selectedFeatures.length === 0) {
      selectedFeatures = e.target.queryRenderedFeatures([e.point.x, e.point.y], {
        layers: [MapsLayers.REGION]
      });
    }

    if (hover && selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0] === hover) {
      return;
    }

    if (hover) {
      e.target.setFeatureState(hover, { ...hover.state, hover: false });
    }

    if (selectedFeatures && selectedFeatures.length > 0) {
      e.target.setFeatureState(selectedFeatures[0], { ...selectedFeatures[0].state, hover: true });

      setHover(selectedFeatures[0]);
    } else {
      setHover(undefined);
    }
  };

  const onClick = (e: MapLayerMouseEvent) => {
    if (!loaded) {
      return;
    }

    let selectedFeatures = e.target.queryRenderedFeatures([e.point.x, e.point.y], {
      layers: ['commune']
    });

    if (selectedFeatures.length === 0) {
      selectedFeatures = e.target.queryRenderedFeatures([e.point.x, e.point.y], {
        layers: ['departement']
      });
    }

    if (selectedFeatures.length === 0) {
      selectedFeatures = e.target.queryRenderedFeatures([e.point.x, e.point.y], {
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
        setPosition(e.lngLat);
        console.log(selectedFeatures[0]);
      } else {
        setClicked(undefined);
      }
    }
  };

  const onSourceData = (e: MapSourceDataEvent) => {
    if (e.isSourceLoaded && e.sourceId === 'decoupageAdministratif') {
      for (const feature of e.target.queryRenderedFeatures(undefined,
        { layers: [MapsLayers.REGION_DATA, MapsLayers.DEPARTEMENT_DATA, MapsLayers.COMMUNE_DATA] })) {

        if (feature.id && feature.source === 'decoupageAdministratif') {
          if (feature.sourceLayer === 'regions' && data.regions && data.regions.regions[feature.id]) {
            e.target.setFeatureState(feature, flatten({ ...feature.state, ...data.regions.regions[feature.id] }));
          } else if (feature.sourceLayer === 'departements' && data.departements && data.departements.departements[feature.id]) {
            e.target.setFeatureState(feature, flatten({ ...feature.state, ...data.departements.departements[feature.id] }));
          } else if (feature.sourceLayer === 'communes' && data.communes && data.communes.communes[feature.id]) {
            e.target.setFeatureState(feature, flatten({ ...feature.state, ...data.communes.communes[feature.id] }));
          }
        }

      }
    }
  };

  useEffect(() => {
    if (clicked && clicked.id && data) {
      switch (clicked.layer.id) {
        case 'region': {
          if (data.regions.regions[clicked.id]) {
            setActiveData(data.regions.regions[clicked.id]);
          }
          break;
        }
        case 'departement': {
          if (data.departements.departements[clicked.id]) {
            setActiveData(data.departements.departements[clicked.id]);
          }
          break;
        }
        case 'commune': {
          if (data.communes.communes[clicked.id]) {
            setActiveData(data.communes.communes[clicked.id]);
          }
          break;
        }
      }
    } else {
      setPosition(undefined);
      setActiveData(undefined);
      setDialog(false);
    }
  }, [clicked, data]);

  useEffect(() => {
    if (loaded && mapRef.current) {
      DataView.fill(DataView.SATELLITE, Level.REGION, data, mapRef.current);
    }
  }, [mapRef, loaded]);

  return (
    <Map id='main'
         ref={ mapRef }
         mapLib={ maplibregl }
         style={ { height: '100%' } }
         mapStyle={ mapStyle }
         maxZoom={ 19 }
         minZoom={ 5 }
         maxBounds={ [[-10, 41.2], [15, 51.45]] }
         initialViewState={ { zoom: 11, latitude: 48.925239263078566, longitude: 2.183056484769497 } }
         renderWorldCopies={ true }
         onMouseMove={ onMouseMove }
         onClick={ onClick }
         onLoad={ () => setLoaded(true) }
         onZoomStart={ e => setClicked(undefined) }
         onSourceData={ onSourceData }
    >
      { position && activeData && (
        <Popup longitude={ position.lng } latitude={ position.lat } anchor='bottom' closeOnMove={ false }
               closeOnClick={ false } closeButton={ false } onClose={ e => setClicked(undefined) }>
          <DataPopup data={ activeData } onClose={ () => setClicked(undefined) } onClick={ () => setDialog(true) }/>
        </Popup>
      )
      }
      <Dialog open={ dialog && !!activeData } fullWidth maxWidth='xl'>
        {
          activeData && <DataDialog data={ activeData } onClose={ () => setDialog(false) }/>
        }
      </Dialog>
    </Map>
  );
}

export default MapPage;

