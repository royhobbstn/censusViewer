export const style = {
  "version": 8,
  "name": "Klokantech Basic",
  "metadata": {
    "mapbox:autocomposite": false,
    "mapbox:type": "template",
    "maputnik:renderer": "mbgljs",
    "openmaptiles:version": "3.x",
    "openmaptiles:mapbox:owner": "openmaptiles",
    "openmaptiles:mapbox:source:url": "mapbox://openmaptiles.4qljc88t"
  },
  "center": [
    8.54806714892635,
    47.37180823552663
  ],
  "zoom": 12.241790506353492,
  "bearing": 0,
  "pitch": 0,
  "sources": {
    "hwirhyucy": {
      "type": "vector",
      "tiles": [
        "https://s3-us-west-2.amazonaws.com/basemap-tiles/census-basemap/{z}/{x}/{y}.pbf"
      ],
      "minZoom": 0,
      "maxZoom": 14,
      "minzoom": 0,
      "maxzoom": 22
    }
  },
  "sprite": "https://openmaptiles.github.io/klokantech-basic-gl-style/sprite",
  "glyphs": "https://free.tilehosting.com/fonts/{fontstack}/{range}.pbf?key={key}",
  "layers": [{
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "rgba(76, 76, 130, 1)"
      }
    },
    {
      "id": "countries",
      "type": "fill",
      "source": "hwirhyucy",
      "source-layer": "countries",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": "rgba(212, 194, 194, 1)"
      }
    },
    {
      "id": "protected_lands",
      "type": "fill",
      "source": "hwirhyucy",
      "source-layer": "protected_lands",
      "paint": {
        "fill-opacity": 0.5,
        "fill-color": "rgba(25, 111, 19, 1)"
      }
    },
    {
      "id": "urban_areas",
      "type": "fill",
      "source": "hwirhyucy",
      "source-layer": "urban_areas",
      "paint": {
        "fill-color": "rgba(162, 97, 51, 1)",
        "fill-opacity": 0.5
      }
    },
    {
      "id": "railroads",
      "type": "line",
      "source": "hwirhyucy",
      "source-layer": "railroads",
      "paint": {
        "line-opacity": 0.5,
        "line-color": "rgba(125, 110, 110, 1)"
      }
    },
    {
      "id": "roads",
      "type": "line",
      "source": "hwirhyucy",
      "source-layer": "roads",
      "layout": {},
      "paint": {
        "line-color": "rgba(197, 72, 72, 1)",
        "line-opacity": 0.75
      }
    },
    {
      "id": "states_provinces",
      "type": "line",
      "source": "hwirhyucy",
      "source-layer": "states_provinces",
      "layout": {},
      "paint": {
        "line-opacity": 0.8,
        "line-color": "rgba(109, 82, 82, 1)"
      }
    },
    {
      "id": "boundary_lines",
      "type": "line",
      "source": "hwirhyucy",
      "source-layer": "boundary_lines",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "line-opacity": 0.8,
        "line-color": "rgba(45, 34, 34, 1)",
        "line-width": 2.5
      }
    },
    {
      "id": "label_points",
      "type": "symbol",
      "source": "hwirhyucy",
      "source-layer": "label_points",
      "layout": {
        "text-field": "name"
      },
      "paint": {
        "text-color": "rgba(103, 7, 7, 1)"
      }
    },
    {
      "id": "populated_places",
      "type": "symbol",
      "source": "hwirhyucy",
      "source-layer": "populated_places"
    }
  ],
  "id": "klokantech-basic"
};
