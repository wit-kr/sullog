/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
import { useRef, useCallback, useState, useEffect } from 'react';
import { LngLatBoundsLike, Style } from 'mapbox-gl';
import ReactMapGL, { MapRef } from 'react-map-gl';
import MAP_STYLE from './map-style-light-v10.json';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.replace(
  / /g,
  ''
);

const maxBounds = [
  {
    lat: 32.671017,
    lng: 125.801356,
  },
  {
    lat: 38.724702,
    lng: 129.693625,
  },
];

const categories = [
  'labels',
  'roads',
  'buildings',
  'parks',
  'water',
  'background',
];

const layerSelector: {
  [key: string]: RegExp;
} = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
  labels: /label|place|poi/,
};

const visibility: {
  [key: string]: boolean;
} = {
  water: true,
  parks: false,
  buildings: false,
  roads: false,
  labels: true,
  background: true,
};

const labelWhiteLists = [
  'hillshade',
  'airport-label',
  'poi-label',
  'settlement-subdivision-label',
];

const Map = () => {
  const [mapStyle, setMapStyle] = useState(MAP_STYLE);

  useEffect(() => {
    const { layers } = mapStyle;

    const selectedLayers = layers.filter((layer) => {
      const { id } = layer;
      return categories.every(
        (name) => visibility[name] || !layerSelector[name].test(id)
      );
    });

    const whiteListedLayers = selectedLayers.filter((layer) => {
      const { id } = layer;
      return !labelWhiteLists.includes(id);
    });

    setMapStyle((prev) => ({
      ...prev,
      layers: whiteListedLayers,
    }));
  }, [mapStyle]);

  return (
    <ReactMapGL
      initialViewState={{
        longitude: 126.977966,
        latitude: 37.516536,
        zoom: 10,
      }}
      style={{
        width: '100%',
        height: '100vh',
      }}
      mapStyle={mapStyle as Style}
      mapboxAccessToken={mapboxAccessToken}
      maxBounds={maxBounds as LngLatBoundsLike}
    />
  );
};

export default Map;