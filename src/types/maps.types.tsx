import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MapRef } from 'react-map-gl';
import { Api, Commune, CommunePopulations, Departement, DepartementPopulations, Level, Region } from 'types/api.types';
import { getAreaExpression, getYearExpression } from 'utils/layer.utils';

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

export enum DataLevel {
  DEPARTEMENT = 'DEPARTEMENT',
  REGION = 'REGION',
  COUNTRY = 'COUNTRY',
}

export namespace DataLevel {

  export function getRank(level: DataLevel, node: Region | Departement | Commune): Record<number, number> {
    switch (level) {
      case DataLevel.COUNTRY:
        return node.population.countryRanks;
      case DataLevel.REGION:
        return (node.population as DepartementPopulations).regionRanks;
      case DataLevel.DEPARTEMENT:
        return (node.population as CommunePopulations).departementRanks;
    }
  }

  export function getDensityRank(level: DataLevel, node: Region | Departement | Commune): Record<number, number> {
    switch (level) {
      case DataLevel.COUNTRY:
        return node.population.densityCountryRanks;
      case DataLevel.REGION:
        return (node.population as DepartementPopulations).densityRegionRanks;
      case DataLevel.DEPARTEMENT:
        return (node.population as CommunePopulations).densityDepartementRanks;
    }
  }

  export function getBirthRank(level: DataLevel, node: Region | Departement | Commune): Record<number, number> {
    switch (level) {
      case DataLevel.COUNTRY:
        return node.population.birthCountryRanks;
      case DataLevel.REGION:
        return (node.population as DepartementPopulations).birthRegionRanks;
      case DataLevel.DEPARTEMENT:
        return (node.population as CommunePopulations).birthDepartementRanks;
    }
  }

  export function getDeathRank(level: DataLevel, node: Region | Departement | Commune): Record<number, number> {
    switch (level) {
      case DataLevel.COUNTRY:
        return node.population.deathCountryRanks;
      case DataLevel.REGION:
        return (node.population as DepartementPopulations).deathRegionRanks;
      case DataLevel.DEPARTEMENT:
        return (node.population as CommunePopulations).deathDepartementRanks;
    }
  }

  export function getRankLength(level: DataLevel, node: Region | Departement | Commune, data: Api): number {
    if ((node as Commune).departement) {
      const commune = (node as Commune);
      switch (level) {
        case DataLevel.COUNTRY:
          return Object.keys(data.common.communes).length;

        case DataLevel.REGION:
          if (data && data.regions && data.departements) {
            const departement = data.departements[commune.departement];

            return data.regions[departement.region].departements.map(d => data.departements[d])
                                                   .filter(d => d !== undefined)
                                                   .map(d => d.communes.length)
                                                   .reduce((acc, v) => {return acc + v;}, 0);
          }
          break;

        case DataLevel.DEPARTEMENT:
          if (data && data.departements && data.departements[commune.departement]) {
            return data.departements[commune.departement].communes.length;
          }
          break;
      }
    } else if ((node as Departement).region) {
      const departement = (node as Departement);
      switch (level) {
        case DataLevel.REGION:
          return data.regions[departement.region].departements.length;

        case DataLevel.COUNTRY:
          return Object.keys(data.departements).length;
      }
    } else if ((node as Region).departements) {
      switch (level) {
        case DataLevel.COUNTRY:
          return Object.keys(data.regions).length;
      }
    }

    return 0;
  }
}

export enum DataView {
  SATELLITE,
  AREA,
  POPULATION,
  DENSITY,
  BIRTH,
  DEATH,
  BIRTH_PER_CAPITA,
  DEATH_PER_CAPITA,
}

export namespace DataView {

  export function fill(view: DataView, level: Level, data: Api, map: MapRef, extra?: any): void {
    resetZooms(map, view, level);

    switch (view) {
      case DataView.SATELLITE:
        map.getMap().setLayoutProperty(MapsLayers.COMMUNE_DATA, 'visibility', 'none');
        map.getMap().setLayoutProperty(MapsLayers.DEPARTEMENT_DATA, 'visibility', 'none');
        map.getMap().setLayoutProperty(MapsLayers.REGION_DATA, 'visibility', 'none');
        break;

      case DataView.AREA:
        map.getMap()
           .setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color', getAreaExpression(data.jenks.area, level));
        map.getMap()
           .setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color', getAreaExpression(data.jenks.area, level));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color', getAreaExpression(data.jenks.area, level));
        break;

      case DataView.POPULATION:
        map.getMap()
           .setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color',
             getYearExpression(data.jenks.population, level, extra.year, 'population'));
        map.getMap()
           .setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color',
             getYearExpression(data.jenks.population, level, extra.year, 'population'));
        map.getMap()
           .setPaintProperty(MapsLayers.REGION_DATA, 'fill-color',
             getYearExpression(data.jenks.population, level, extra.year, 'population'));
        break;

      case DataView.DENSITY:
        map.getMap()
           .setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color',
             getYearExpression(data.jenks.density, level, extra.year, 'density'));
        map.getMap()
           .setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color',
             getYearExpression(data.jenks.density, level, extra.year, 'density'));
        map.getMap()
           .setPaintProperty(MapsLayers.REGION_DATA, 'fill-color',
             getYearExpression(data.jenks.density, level, extra.year, 'density'));
        break;

      case DataView.BIRTH:
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color',
          getYearExpression(data.jenks.birth, level, extra.year, 'birth'));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color',
          getYearExpression(data.jenks.birth, level, extra.year, 'birth'));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color',
          getYearExpression(data.jenks.birth, level, extra.year, 'birth'));
        break;

      case DataView.DEATH:
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color',
          getYearExpression(data.jenks.death, level, extra.year, 'death'));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color',
          getYearExpression(data.jenks.death, level, extra.year, 'death'));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color',
          getYearExpression(data.jenks.death, level, extra.year, 'death'));
        break;

      case DataView.BIRTH_PER_CAPITA:
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color',
          getYearExpression(data.jenks.birthPerCapita, level, extra.year, 'birthPerCapita'));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color',
          getYearExpression(data.jenks.birthPerCapita, level, extra.year, 'birthPerCapita'));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color',
          getYearExpression(data.jenks.birthPerCapita, level, extra.year, 'birthPerCapita'));
        break;

      case DataView.DEATH_PER_CAPITA:
        map.getMap().setPaintProperty(MapsLayers.COMMUNE_DATA, 'fill-color',
          getYearExpression(data.jenks.deathPerCapita, level, extra.year, 'deathPerCapita'));
        map.getMap().setPaintProperty(MapsLayers.DEPARTEMENT_DATA, 'fill-color',
          getYearExpression(data.jenks.deathPerCapita, level, extra.year, 'deathPerCapita'));
        map.getMap().setPaintProperty(MapsLayers.REGION_DATA, 'fill-color',
          getYearExpression(data.jenks.deathPerCapita, level, extra.year, 'deathPerCapita'));
        break;
    }
  }

  export function subMenu(layer: DataView, level: Level, data: Api, extra: any, setExtra: (value: any) => void): React.ReactNode {
    switch (layer) {
      case DataView.SATELLITE:
      case DataView.AREA:
        return <></>;
      case DataView.POPULATION:
        return yearsAutocomplete(Object.keys(data.jenks.population).reverse(), extra, setExtra);
      case DataView.DENSITY:
        return yearsAutocomplete(Object.keys(data.jenks.density).reverse(), extra, setExtra);
      case DataView.BIRTH:
        return yearsAutocomplete(Object.keys(data.jenks.birth).reverse(), extra, setExtra);
      case DataView.DEATH:
        return yearsAutocomplete(Object.keys(data.jenks.death).reverse(), extra, setExtra);
      case DataView.BIRTH_PER_CAPITA:
        return yearsAutocomplete(Object.keys(data.jenks.birthPerCapita).reverse(), extra, setExtra);
      case DataView.DEATH_PER_CAPITA:
        return yearsAutocomplete(Object.keys(data.jenks.deathPerCapita).reverse(), extra, setExtra);
    }
  }

  function yearsAutocomplete(years: Array<string>, extra: any, setExtra: (value: any) => void): React.ReactNode {
    if (years.length === 0) {
      return <></>;
    }

    if (!extra.year || !years.includes(extra.year)) {
      setExtra({ ...extra, year: years[0] });
    }

    return (
      <Autocomplete
        disableClearable
        options={ years }
        getOptionLabel={ option => option.toString() }
        isOptionEqualToValue={ (option, value) => option == value }
        value={ extra.year }
        onChange={ (event: any, newValue: number) => {
          setExtra({ ...extra, year: newValue });
        } }
        renderInput={ (params) => <TextField { ...params } label={ <FormattedMessage id="view.year"/> }/> }
      />
    );
  }

  function resetZooms(map: MapRef, view: DataView, level: Level): void {
    resetCommune(map);
    resetDepartement(map);
    resetRegion(map);

    switch (level) {
      case Level.COMMUNE:
        zoomCommune(map);
        break;
      case Level.DEPARTEMENT:
        zoomDepartement(map);
        break;
    }
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
    changeLayers(map, [MapsLayers.REGION, MapsLayers.REGION_DATA, MapsLayers.REGION_LINE, MapsLayers.REGION_NAME], min,
      max, visibility);
  }

  function changeDepartement(map: MapRef, min?: number, max?: number, visibility?: boolean): void {
    changeLayers(map,
      [MapsLayers.DEPARTEMENT, MapsLayers.DEPARTEMENT_DATA, MapsLayers.DEPARTEMENT_LINE, MapsLayers.DEPARTEMENT_NAME],
      min, max, visibility);
  }

  function changeCommune(map: MapRef, min?: number, max?: number, visibility?: boolean): void {
    changeLayers(map, [MapsLayers.COMMUNE, MapsLayers.COMMUNE_DATA, MapsLayers.COMMUNE_LINE, MapsLayers.COMMUNE_NAME],
      min, max, visibility);
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
