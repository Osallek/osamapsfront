import { Style } from 'mapbox-gl';

export const mapStyle: Style = {
  version: 8,
  name: 'OsallekMaps',
  sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite',
  glyphs: 'https://openmaptiles.geo.data.gouv.fr/fonts/{fontstack}/{range}.pbf',
  sources: {
    decoupageAdministratif: {
      type: 'vector',
      url: 'https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif.json'
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
      id: 'satellite',
      type: 'raster',
      source: 'opendata',
      paint: {
        'raster-resampling': 'linear'
      }
    },
    {
      id: 'region_line',
      type: 'line',
      source: 'decoupageAdministratif',
      'source-layer': 'regions',
      layout: {
        'line-join': 'bevel'
      },
      paint: {
        'line-color': 'black',
        'line-width': 1.5
      }
    },
    {
      id: 'region',
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'regions',
      paint: {
        'fill-color': 'black',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          0
        ]
      }
    },
    {
      id: 'region_name',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      maxzoom: 7.5,
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
              12,
              14
            ],
            [
              15,
              17
            ]
          ]
        },
        'text-transform': 'uppercase',
        visibility: 'visible'
      },
      'paint': {
        'text-color': 'black',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 1.2
      }
    },
    {
      id: 'departement',
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'departements',
      minzoom: 7.5,
      maxzoom: 11,
      paint: {
        'fill-color': 'yellow',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          0
        ]
      }
    },
    {
      id: 'departement_line',
      type: 'line',
      source: 'decoupageAdministratif',
      'source-layer': 'departements',
      minzoom: 7.5,
      paint: {
        'line-color': 'yellow',
        'line-opacity': 1,
        'line-width': 1
      }
    },
    {
      id: 'departement_name',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 7.5,
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
          "<=",
          "rank",
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
              14
            ],
            [
              11,
              24
            ]
          ]
        },
        visibility: 'visible'
      },
      'paint': {
        'text-color': 'black',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 1.2
      }
    },
    {
      id: 'commune',
      type: 'fill',
      source: 'decoupageAdministratif',
      'source-layer': 'communes',
      minzoom: 11,
      maxzoom: 15,
      paint: {
        'fill-color': 'pink',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          0
        ]
      }
    },
    {
      id: 'commune_line',
      type: 'line',
      source: 'decoupageAdministratif',
      'source-layer': 'communes',
      minzoom: 11,
      paint: {
        'line-color': 'pink',
        'line-width': 1.5,
        'line-opacity': 1,
        'line-blur': 0
      }
    },
    {
      id: 'commune_name',
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
              14
            ],
            [
              11,
              24
            ]
          ]
        },
        visibility: 'visible'
      },
      'paint': {
        'text-color': 'black',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 1.2
      }
    },
  ]
};
