import { Dialog } from '@mui/material';
import { MapGeoJSONFeature } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { LngLat, Popup } from 'react-map-gl';
import Map, { MapLayerMouseEvent, MapRef, MapSourceDataEvent } from 'react-map-gl/maplibre';
import DataDialog from 'screens/dialog/DataDialog';
import { mapStyle } from 'screens/map/map-style';
import DataPopup from 'screens/popup/DataPopup';
import { Api, Commune, Departement, Level, Region } from 'types/api.types';
import { MapsLayers } from 'types/maps.types';
import { fetchRegion, fetchCommune, fetchDepartement } from 'utils/api.utils';
import { getFeatureState } from 'utils/layer.utils';

interface MapPageProps {
  data: Api;
}

function MapPage({ data }: MapPageProps) {
  const [hover, setHover] = useState<MapGeoJSONFeature | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [clicked, setClicked] = useState<MapGeoJSONFeature | undefined>(undefined);
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

    if (hover && selectedFeatures && selectedFeatures.length > 0 && selectedFeatures[0].id === hover.id) {
      return;
    }

    if (hover) {
      e.target.setFeatureState(hover, { ...hover.state, hover: false });
    }

    if (selectedFeatures && selectedFeatures.length > 0) {
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

        if (feature.id && feature.source === 'decoupageAdministratif' && !feature.state.loaded) {
          if (feature.sourceLayer === 'regions') {
            e.target.setFeatureState(feature, getFeatureState(data, Level.REGION, feature.id as string, feature.state));
          } else if (feature.sourceLayer === 'departements') {
            e.target.setFeatureState(feature,
              getFeatureState(data, Level.DEPARTEMENT, feature.id as string, feature.state));
          } else if (feature.sourceLayer === 'communes') {
            e.target.setFeatureState(feature,
              getFeatureState(data, Level.COMMUNE, feature.id as string, feature.state));
          }
        }

      }
    }
  };

  useEffect(() => {
    if (hover && mapRef.current) {
      mapRef.current.setFeatureState(hover, { ...hover.state, hover: true });
    }
  }, [hover]);

  useEffect(() => {
    ;(async () => {
      if (clicked && clicked.id && data) {
        switch (clicked.layer.id) {
          case 'region': {
            if (data.common.regions.indexOf(clicked.id as string) >= 0) {
              await fetchRegion(data, clicked.id as string);
              setActiveData(data.regions[clicked.id]);
            }
            break;
          }
          case 'departement': {
            if (data.common.departements.indexOf(clicked.id as string) >= 0) {
              await fetchDepartement(data, clicked.id as string);
              setActiveData(data.departements[clicked.id]);
            }
            break;
          }
          case 'commune': {
            if (data.common.communes.indexOf(clicked.id as string) >= 0) {
              await fetchCommune(data, clicked.id as string);
              setActiveData(data.communes[clicked.id]);
            }
            break;
          }
        }
      } else {
        setPosition(undefined);
        setActiveData(undefined);
        setDialog(false);
      }
    })();
  }, [clicked, data]);

  return (
    <Map id="main"
         ref={ mapRef }
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
        <Popup longitude={ position.lng } latitude={ position.lat } anchor="bottom" closeOnMove={ false }
               closeOnClick={ false } closeButton={ false } onClose={ e => setClicked(undefined) }>
          <DataPopup data={ activeData } onClose={ () => setClicked(undefined) } onClick={ () => setDialog(true) }/>
        </Popup>
      )
      }
      <Dialog open={ dialog && !!activeData } fullWidth maxWidth="xl">
        {
          activeData && <DataDialog data={ activeData } onClose={ () => setDialog(false) }/>
        }
      </Dialog>
    </Map>
  );
}

export default MapPage;

