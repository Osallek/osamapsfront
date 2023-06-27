import { Style } from 'mapbox-gl';

export const mapStyle: Style = {
  version: 8,
  name: 'Positron',
  sources: {
    carto: {
      'type': 'vector',
      'url': 'https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json'
    }
  },
  sprite: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/sprite',
  glyphs: 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'background',
      type: 'background',
      layout: {
        visibility: 'visible'
      },
      paint: {
        'background-color': '#fafaf8',
        'background-opacity': 1
      }
    },
    {
      id: 'waterway',
      type: 'line',
      source: 'carto',
      'source-layer': 'waterway',
      paint: {
        'line-color': '#d1dbdf',
        'line-width': {
          stops: [
            [
              8,
              0.5
            ],
            [
              9,
              1
            ],
            [
              15,
              2
            ],
            [
              16,
              3
            ]
          ]
        }
      }
    },
    {
      id: 'water',
      type: 'fill',
      source: 'carto',
      'source-layer': 'water',
      minzoom: 0,
      maxzoom: 16,
      filter: [
        'all',
        [
          '==',
          '$type',
          'Polygon'
        ]
      ],
      layout: {
        visibility: 'visible'
      },
      paint: {
        'fill-color': '#6d9dfe',
        'fill-antialias': true,
        'fill-translate-anchor': 'map',
        'fill-opacity': 1
      }
    },
    {
      id: 'water_shadow',
      type: 'fill',
      source: 'carto',
      'source-layer': 'water',
      minzoom: 0,
      filter: [
        'all',
        [
          '==',
          '$type',
          'Polygon'
        ]
      ],
      layout: {
        visibility: 'visible'
      },
      paint: {
        'fill-color': 'transparent',
        'fill-antialias': true,
        'fill-translate-anchor': 'map',
        'fill-opacity': 1
      }
    }
  ]
};
