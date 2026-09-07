import { useEffect } from 'react';
import { CircleMarker, ImageOverlay, MapContainer, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MoveToSelectedCctv({ selectedCctv }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedCctv) {
      return;
    }

    map.setView([selectedCctv.y, selectedCctv.x], 1, {
      animate: true
    });
  }, [map, selectedCctv]);

  return null;
}

function CoordinatePicker({ enabled, onPick }) {
  useMapEvents({
    click(event) {
      if (!enabled) {
        return;
      }

      const x = Math.round(event.latlng.lng);
      const y = Math.round(event.latlng.lat);

      onPick({ x, y });
    }
  });

  return null;
}

function MapViewer({
  imageSize,
  selectedLayer,
  cctvs = [],
  selectedCctv,
  coordinateMode,
  onCoordinatePick
}) {
  const bounds = [
    [0, 0],
    [imageSize.height, imageSize.width]
  ];

  const imageUrl = `${import.meta.env.BASE_URL}${selectedLayer.imageUrl}`;

  return (
    <MapContainer
      className="map-container"
      crs={L.CRS.Simple}
      bounds={bounds}
      maxBounds={bounds}
      minZoom={-1}
      maxZoom={4}
      zoomSnap={0.25}
      wheelPxPerZoomLevel={80}
    >
      <ImageOverlay url={imageUrl} bounds={bounds} />

      {cctvs.map((cctv) => (
        <CircleMarker
          key={cctv.id}
          center={[cctv.y, cctv.x]}
          radius={5}
          pathOptions={{
            color: '#dc2626',
            weight: 2,
            fillColor: '#ffffff',
            fillOpacity: 0.15
          }}
        >
          <Popup>
            <div className="cctv-popup">
              <strong>{cctv.name}</strong>
              <p>{cctv.memo}</p>
              <p>
                x {cctv.x}, y {cctv.y}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      <MoveToSelectedCctv selectedCctv={selectedCctv} />

      <CoordinatePicker
        enabled={coordinateMode}
        onPick={onCoordinatePick}
      />
    </MapContainer>
  );
}

export default MapViewer;
