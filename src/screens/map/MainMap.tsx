import { LngLat, MapboxGeoJSONFeature, MapSourceDataEvent } from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { Map, MapLayerMouseEvent, MapRef, Popup } from 'react-map-gl';
import { mapStyle } from 'screens/map/map-style';
import DataPopup from 'screens/popup/DataPopup';
import { Commune, Data, Departement, Region } from 'types/api.types';
import { getGradient } from 'utils/colors.utils';
import { getAreaExpression } from 'utils/layer.utils';

interface MapPageProps {
  data: Data;
}

function MapPage({ data }: MapPageProps) {
  const [hover, setHover] = useState<MapboxGeoJSONFeature | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [clicked, setClicked] = useState<MapboxGeoJSONFeature | undefined>(undefined);
  const [position, setPosition] = useState<LngLat | undefined>(undefined);
  const [activeData, setActiveData] = useState<Commune | Departement | Region | undefined>(undefined);
  const mapRef = useRef<MapRef>(null);

  const onMouseMove = (e: MapLayerMouseEvent) => {
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
        { layers: ['region_data', 'departement_data', 'commune_data'] })) {

        if (feature.id && feature.source === 'decoupageAdministratif') {
          if (feature.sourceLayer === 'regions' && data.regions && data.regions[feature.id]) {
            e.target.setFeatureState(feature, { hover: false, area: data.regions[feature.id].area });
          } else if (feature.sourceLayer === 'departements' && data.departements && data.departements[feature.id]) {
            e.target.setFeatureState(feature, { hover: false, area: data.departements[feature.id].area });
          } else if (feature.sourceLayer === 'communes' && data.communes && data.communes[feature.id]) {
            e.target.setFeatureState(feature, { hover: false, area: data.communes[feature.id].area });
          }
        }

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

  useEffect(() => {
    if (loaded && mapRef.current) {
      if (data.regions) {
        mapRef.current.getMap().setPaintProperty('region_data', 'fill-color', getAreaExpression(data.regions));
        mapRef.current.getMap().setLayoutProperty('region_data', 'visibility', 'visible');
      }

      if (data.departements) {
        console.log(getAreaExpression(data.departements))
        mapRef.current.getMap().setPaintProperty('departement_data', 'fill-color', getAreaExpression(data.departements));
        mapRef.current.getMap().setLayoutProperty('departement_data', 'visibility', 'visible');
      }

      if (data.communes) {
        mapRef.current.getMap().setPaintProperty('commune_data', 'fill-color', getAreaExpression(data.communes));
        mapRef.current.getMap().setLayoutProperty('commune_data', 'visibility', 'visible');
      }
    }
  }, [data.regions, mapRef, loaded]);

  return (
    <Map id="main"
         ref={ mapRef }
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
         onSourceData={ onSourceData }
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

