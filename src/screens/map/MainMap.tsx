import { Dialog } from '@mui/material';
import { merge } from 'lodash';
import { MapGeoJSONFeature } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { LngLat, Popup } from 'react-map-gl';
import Map, { MapLayerMouseEvent, MapRef, MapSourceDataEvent } from 'react-map-gl/maplibre';
import DataDialog from 'screens/dialog/DataDialog';
import { mapStyle } from 'screens/map/map-style';
import DataPopup from 'screens/popup/DataPopup';
import { Api, Commune, Departement, Region } from 'types/api.types';
import { MapsLayers } from 'types/maps.types';
import { flatten } from 'utils/object.utils';

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

        if (feature.id && feature.source === 'decoupageAdministratif' && !feature.state.loaded) {
          if (feature.sourceLayer === 'regions' && data.common.regions && data.common.regions.regions[feature.id]) {
            e.target.setFeatureState(feature,
              flatten(merge({},
                feature.state, data.common.regions.regions[feature.id], data.pop.regions.regions[feature.id],
                data.density.regions.regions[feature.id], data.deathPerCapita.regions.regions[feature.id],
                data.birthPerCapita.regions.regions[feature.id], data.death.regions.regions[feature.id],
                data.birth.regions.regions[feature.id], data.area.regions.regions[feature.id],
                { loaded: true }
              )));
          } else if (feature.sourceLayer === 'departements' && data.common.departements && data.common.departements.departements[feature.id]) {
            e.target.setFeatureState(feature,
              flatten(merge({},
                feature.state, data.common.departements.departements[feature.id],
                data.pop.departements.departements[feature.id],
                data.density.departements.departements[feature.id],
                data.deathPerCapita.departements.departements[feature.id],
                data.birthPerCapita.departements.departements[feature.id],
                data.death.departements.departements[feature.id],
                data.birth.departements.departements[feature.id], data.area.departements.departements[feature.id],
                { loaded: true }
              )));
          } else if (feature.sourceLayer === 'communes' && data.common.communes && data.common.communes.communes[feature.id]) {
            e.target.setFeatureState(feature,
              flatten(merge({},
                feature.state, data.common.communes.communes[feature.id], data.pop.communes.communes[feature.id],
                data.density.communes.communes[feature.id], data.deathPerCapita.communes.communes[feature.id],
                data.birthPerCapita.communes.communes[feature.id], data.death.communes.communes[feature.id],
                data.birth.communes.communes[feature.id], data.area.communes.communes[feature.id],
                { loaded: true }
              )));
          }
        }

      }
    }
  };

  useEffect(() => {
    if (clicked && clicked.id && data) {
      switch (clicked.layer.id) {
        case 'region': {
          if (data.common.regions.regions[clicked.id]) {
            setActiveData(merge({},
              data.common.regions.regions[clicked.id], data.pop.regions.regions[clicked.id],
              data.density.regions.regions[clicked.id], data.deathPerCapita.regions.regions[clicked.id],
              data.birthPerCapita.regions.regions[clicked.id], data.death.regions.regions[clicked.id],
              data.birth.regions.regions[clicked.id], data.area.regions.regions[clicked.id]));
          }
          break;
        }
        case 'departement': {
          if (data.common.departements.departements[clicked.id]) {
            setActiveData(merge({},
              data.common.departements.departements[clicked.id], data.pop.departements.departements[clicked.id],
              data.density.departements.departements[clicked.id],
              data.deathPerCapita.departements.departements[clicked.id],
              data.birthPerCapita.departements.departements[clicked.id],
              data.death.departements.departements[clicked.id],
              data.birth.departements.departements[clicked.id], data.area.departements.departements[clicked.id]));
          }
          break;
        }
        case 'commune': {
          if (data.pop.communes.communes[clicked.id]) {
            setActiveData(merge({},
              data.common.communes.communes[clicked.id], data.pop.communes.communes[clicked.id],
              data.density.communes.communes[clicked.id], data.deathPerCapita.communes.communes[clicked.id],
              data.birthPerCapita.communes.communes[clicked.id], data.death.communes.communes[clicked.id],
              data.birth.communes.communes[clicked.id], data.area.communes.communes[clicked.id]));
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

