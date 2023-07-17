import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MapRef } from 'react-map-gl';
import { Data, Level } from 'types/api.types';
import { getAreaExpression, getPopulationExpression } from 'utils/layer.utils';
import { onlyUnique } from 'utils/object.utils';

export enum MapsLayers {
  SATELLITE = 'satellite',
  REGION = 'region',
  REGION_DATA = 'region_data',
  REGION_LINE = 'region_line',
  REGION_NAME = 'region_name',
  DEPARTEMENT = 'departement',
  DEPARTEMENT_DATA = 'departement_data',
  DEPARTEMENT_LINE = 'departement_line',
  DEPARTEMENT_NAME = 'departement_name',
  COMMUNE = 'commune',
  COMMUNE_DATA = 'commune_data',
  COMMUNE_LINE = 'commune_line',
  COMMUNE_NAME = 'commune_name',
}

export enum DataView {
  SATELLITE,
  AREA_REGION,
  AREA_DEPARTEMENT,
  AREA_COMMUNE,
  POPULATION_REGION,
  POPULATION_DEPARTEMENT,
  POPULATION_COMMUNE,
}

export namespace DataView {

  export function fill(layer: DataView, data: Data, map: MapRef, extra?: any): void {
    resetZooms(map);

    switch (layer) {
      case DataView.SATELLITE:
        map.getMap().setLayoutProperty(MapsLayers.COMMUNE_DATA, 'visibility', 'none');
        map.getMap().setLayoutProperty(MapsLayers.DEPARTEMENT_DATA, 'visibility', 'none');
        map.getMap().setLayoutProperty(MapsLayers.REGION_DATA, 'visibility', 'none');
        break;

      case DataView.AREA_COMMUNE:
        zoomCommune(map);
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color', getAreaExpression(data.communes.jenks));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color', getAreaExpression(data.regions.jenks));
        break;

      case DataView.AREA_DEPARTEMENT:
        zoomDepartement(map);
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color', getAreaExpression(data.communes.jenks));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color', getAreaExpression(data.departements.jenks));
        break;

      case DataView.AREA_REGION:
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color', getAreaExpression(data.communes.jenks));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color', getAreaExpression(data.departements.jenks));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color', getAreaExpression(data.regions.jenks));
        break;

      case DataView.POPULATION_COMMUNE:
        zoomCommune(map);
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color', getPopulationExpression(data.communes.jenks, extra.year));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color', getPopulationExpression(data.regions.jenks, extra.year));
        break;

      case DataView.POPULATION_DEPARTEMENT:
        zoomDepartement(map);
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color', getPopulationExpression(data.communes.jenks, extra.year));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color', getPopulationExpression(data.departements.jenks, extra.year));
        break;

      case DataView.POPULATION_REGION:
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color', getPopulationExpression(data.communes.jenks, extra.year));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color', getPopulationExpression(data.departements.jenks, extra.year));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color', getPopulationExpression(data.regions.jenks, extra.year));
        break;
    }
  }

  export function subMenu(layer: DataView, data: Data, extra: any, setExtra: (value: any) => void): React.ReactNode {
    switch (layer) {
      case DataView.SATELLITE:
      case DataView.AREA_COMMUNE:
      case DataView.AREA_DEPARTEMENT:
      case DataView.AREA_REGION:
        return <></>;
      case DataView.POPULATION_COMMUNE:
      case DataView.POPULATION_DEPARTEMENT:
      case DataView.POPULATION_REGION:
        const years = Object.values(data.regions.regions).filter(c => !!c.population && !!c.population.population)
          .map(c => Object.keys(c.population.population)).flat().filter(onlyUnique).sort().reverse();

        if (years.length === 0) {
          return <></>;
        }

        if (!extra.year) {
          setExtra({ ...extra, year: years[0] });
        }

        return (
          <Autocomplete
            disablePortal
            disableClearable
            options={ years }
            getOptionLabel={ option => option.toString() }
            isOptionEqualToValue={ (option, value) => option == value }
            value={ extra.year }
            onChange={ (event: any, newValue: number) => {
              extra.year = Number(newValue);
              setExtra({ ...extra });
            } }
            renderInput={ (params) => <TextField { ...params } label={ <FormattedMessage id='view.year'/> }/> }
          />
        )
    }
  }

  function resetZooms(map: MapRef): void {
    resetCommune(map);
    resetDepartement(map);
    resetRegion(map);
  }

  function resetRegion(map: MapRef): void {
    changeRegion(map, 1, 8, true);
  }

  function resetDepartement(map: MapRef): void {
    changeDepartement(map, 8, 11, true);
  }

  function resetCommune(map: MapRef): void {
    changeCommune(map, 11, 15, true);
  }

  function zoomDepartement(map: MapRef): void {
    changeDepartement(map, 1, 11, true);
    changeRegion(map, undefined, undefined, false);
  }

  function zoomCommune(map: MapRef): void {
    changeRegion(map, 1, 8, true);
    changeDepartement(map, undefined, undefined, false);
    changeCommune(map, 8, 15, true);
  }

  function changeRegion(map: MapRef, min?: number, max?: number, visibility?: boolean): void {
    changeLayers(map, [MapsLayers.REGION, MapsLayers.REGION_DATA, MapsLayers.REGION_LINE, MapsLayers.REGION_NAME], min, max, visibility);
  }

  function changeDepartement(map: MapRef, min?: number, max?: number, visibility?: boolean): void {
    changeLayers(map, [MapsLayers.DEPARTEMENT, MapsLayers.DEPARTEMENT_DATA, MapsLayers.DEPARTEMENT_LINE, MapsLayers.DEPARTEMENT_NAME], min, max, visibility);
  }

  function changeCommune(map: MapRef, min?: number, max?: number, visibility?: boolean): void {
    changeLayers(map, [MapsLayers.COMMUNE, MapsLayers.COMMUNE_DATA, MapsLayers.COMMUNE_LINE, MapsLayers.COMMUNE_NAME], min, max, visibility);
  }

  function changeLayers(map: MapRef, layers: Array<MapsLayers>, min?: number, max?: number, visibility?: boolean): void {
    for (const layer of layers) {
      if (visibility !== undefined) {
        map.getMap().setLayoutProperty(layer, 'visibility', visibility ? 'visible' : 'none');
      }

      if (min !== undefined || max !== undefined) {
        map.getMap().setLayerZoomRange(layer, min ?? 1, max ?? 15);
      }
    }
  }
}
