import { Style } from 'mapbox-gl';
import { MapsLayers } from 'types/maps.types';

export const mapStyle: Style = {
  version: 8,
  name: 'OsallekMaps',
  sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite',
  glyphs: 'https://openmaptiles.geo.data.gouv.fr/fonts/{fontstack}/{range}.pbf',
  sources: {
    decoupageAdministratif: {
      type: 'vector',
      url: 'https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif.json',
      promoteId: 'code'
    },
    opendata: {
      type: 'raster',
      tiles: [
        'https://wxs.ign.fr/essentiels/geoportail/wmts?layer=ORTHOIMAGERY.ORTHOPHOTOS&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}'
      ],
      tileSize: 256,
      attribution: 'Images aériennes @ IGN',
      minzoom: 0,
      maxzoom: 19
    },
    openmaptiles: {
      type: 'vector',
      url: 'https://openmaptiles.geo.data.gouv.fr/data/france-vector.json'
    }
  },
  layers: [
    {
      id: MapsLayers.SATELLITE,
      type: 'raster',
      source: 'opendata',
      paint: {
        'raster-resampling': 'linear'
      }
    },
    {
      id: MapsLayers.REGION,
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'regions',
      maxzoom: 8,
      paint: {
        'fill-color': 'white',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          0
        ]
      }
    },
    {
      id: MapsLayers.REGION_DATA,
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'regions',
      maxzoom: 8,
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-opacity': 0.8
      },
    },
    {
      id: MapsLayers.REGION_LINE,
      type: 'line',
      source: 'decoupageAdministratif',
      'source-layer': 'regions',
      layout: {
        'line-join': 'bevel'
      },
      paint: {
        'line-color': 'white',
        'line-width': 1.5,
        'line-opacity': 0.7,
      }
    },
    {
      id: MapsLayers.DEPARTEMENT,
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'departements',
      minzoom: 8,
      maxzoom: 11,
      paint: {
        'fill-color': 'white',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          0
        ]
      }
    },
    {
      id: MapsLayers.DEPARTEMENT_DATA,
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'departements',
      minzoom: 8,
      maxzoom: 11,
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-opacity': 0.8
      },
    },
    {
      id: MapsLayers.DEPARTEMENT_LINE,
      type: 'line',
      source: 'decoupageAdministratif',
      'source-layer': 'departements',
      minzoom: 8,
      paint: {
        'line-color': 'white',
        'line-width': 1.5,
        'line-opacity': 0.7,
      }
    },
    {
      id: MapsLayers.COMMUNE,
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'communes',
      minzoom: 11,
      maxzoom: 15,
      filter: [
        '!has',
        'commune'
      ],
      paint: {
        'fill-color': 'white',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          0
        ]
      }
    },
    {
      id: MapsLayers.COMMUNE_DATA,
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'communes',
      minzoom: 11,
      maxzoom: 15,
      filter: [
        '!has',
        'commune'
      ],
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-opacity': 0.8
      },
    },
    {
      id: MapsLayers.COMMUNE_LINE,
      type: 'line',
      source: 'decoupageAdministratif',
      'source-layer': 'communes',
      minzoom: 11,
      filter: [
        '!has',
        'commune'
      ],
      paint: {
        'line-color': 'white',
        'line-width': 1.5,
        'line-opacity': 0.7,
      }
    },
    {
      id: MapsLayers.REGION_NAME,
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      maxzoom: 8,
      filter: [
        '!in',
        'class',
        'city',
        'town',
        'village',
        'country',
        'continent'
      ],
      layout: {
        'text-field': '{name:fr}',
        'text-font': [
          'Noto Sans Bold'
        ],
        'text-letter-spacing': 0.1,
        'text-max-width': 9,
        'text-size': {
          base: 1.6,
          stops: [
            [
              1,
              11
            ],
            [
              7,
              15
            ],
          ]
        },
        'text-transform': 'uppercase',
        visibility: 'visible'
      },
      'paint': {
        'text-color': 'white',
        'text-halo-color': 'rgba(0,0,0,0.8)',
        'text-halo-width': 1.2
      }
    },
    {
      id: MapsLayers.DEPARTEMENT_NAME,
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 8,
      maxzoom: 11,
      filter: [
        'all',
        [
          'in',
          'class',
          'city',
          'town'
        ],
        [
          '<=',
          'rank',
          11
        ],
      ],
      layout: {
        'text-field': '{name:fr}',
        'text-font': [
          'Noto Sans Regular'
        ],
        'text-max-width': 8,
        'text-size': {
          base: 1.2,
          stops: [
            [
              7,
              10
            ],
            [
              11,
              20
            ]
          ]
        },
        visibility: 'visible'
      },
      'paint': {
        'text-color': 'white',
        'text-halo-color': 'rgba(0,0,0,0.8)',
        'text-halo-width': 1.2
      }
    },
    {
      id: MapsLayers.COMMUNE_NAME,
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 11,
      maxzoom: 15,
      filter: [
        'all',
        [
          'in',
          'class',
          'city',
          'town',
          'village'
        ]
      ],
      layout: {
        'text-field': '{name:fr}',
        'text-font': [
          'Noto Sans Regular'
        ],
        'text-max-width': 8,
        'text-size': {
          base: 1.2,
          stops: [
            [
              7,
              10
            ],
            [
              11,
              20
            ]
          ]
        },
        visibility: 'visible'
      },
      'paint': {
        'text-color': 'white',
        'text-halo-color': 'rgba(0,0,0,0.8)',
        'text-halo-width': 1.2,
      }
    },
  ]
};
