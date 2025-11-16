"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import MapComponent, {
  Layer,
  LayerProps,
  Source,
  useMap,
} from "react-map-gl/mapbox";
import { useEffect } from "react";
import bbox from "@turf/bbox";

export function Map({
  geoJson,
  height = 400,
}: {
  geoJson?: GeoJSON.FeatureCollection<
    GeoJSON.Geometry | null,
    GeoJSON.GeoJsonProperties
  >;
  height?: number;
}) {
  const { map } = useMap();

  useEffect(() => {
    console.log("map", map, geoJson);
    if (map && geoJson) {
      const [minLng, minLat, maxLng, maxLat] = bbox(
        geoJson as GeoJSON.FeatureCollection
      );

      map.fitBounds([minLng, minLat, maxLng, maxLat], {
        padding: 40,
        duration: 1000,
      });
    }
  }, [map, geoJson]);

  if (!geoJson) return null;

  return (
    <MapComponent
      id="map"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 3,
      }}
      style={{ width: "100%", height }}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      <Source type="geojson" data={geoJson as GeoJSON.FeatureCollection}>
        <Layer {...fillLayer} />
        <Layer {...lineLayer} />
      </Source>
    </MapComponent>
  );
}

const fillLayer: LayerProps = {
  id: "region-fill",
  type: "fill",
  paint: {
    "fill-color": "#22c55e",
    "fill-opacity": 0.3,
  },
};

const lineLayer: LayerProps = {
  id: "region-line",
  type: "line",
  paint: {
    "line-color": "#16a34a",
    "line-width": 2,
  },
};
