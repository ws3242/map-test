import { useEffect, useMemo, useRef } from 'react';
import { CircleMarker, ImageOverlay, MapContainer, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

function FitBoundsButton({ bounds }) {
  const map = useMap();

  return (
    <button
      className="map-control-button fit-button"
      type="button"
      onClick={() => map.fitBounds(bounds)}
    >
      전체 보기
    </button>
  );
}

function MoveToSelected({ selectedTarget }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedTarget) {
      return;
    }

    map.setView([selectedTarget.y, selectedTarget.x], Math.max(map.getZoom(), 1), {
      animate: true
    });
  }, [map, selectedTarget]);

  return null;
}

function MapClickLogger({ devMode, onMapClick }) {
  useMapEvents({
    click(event) {
      if (!devMode) {
        return;
      }

      const nextClick = {
        x: Math.round(event.latlng.lng),
        y: Math.round(event.latlng.lat)
      };

      onMapClick(nextClick);
      console.log('이미지 좌표:', nextClick);
    }
  });

  return null;
}

export default function MapViewer({
  imageSize,
  selectedLayer,
  cctvList,
  selectedTarget,
  devMode,
  onMapClick
}) {
  const mapRef = useRef(null);

  const bounds = useMemo(() => {
    return [
      [0, 0],
      [imageSize.height, imageSize.width]
    ];
  }, [imageSize.height, imageSize.width]);

  if (!selectedLayer) {
    return <div className="map-placeholder">지도 데이터를 불러오는 중입니다.</div>;
  }

  return (
    <div className="map-wrapper">
      <MapContainer
        ref={mapRef}
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={0.7}
        minZoom={-1}
        maxZoom={4}
        zoomSnap={0.25}
        wheelPxPerZoomLevel={90}
        className="leaflet-map"
      >
        {selectedLayer.available ? (
          <ImageOverlay url={`${import.meta.env.BASE_URL}${selectedLayer.imageUrl}`} bounds={bounds} />
        ) : (
          <div className="map-placeholder">아직 추가되지 않은 지도입니다.</div>
        )}

        {selectedLayer.id === 'blue' && cctvList.map((cctv) => (
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

            <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
              {cctv.name}
            </Tooltip>
            <Popup>
              <div className="popup-content">
                <strong>{cctv.name}</strong>
                <span>유형: 고정식 불법주정차 단속 CCTV</span>
                <span>좌표: x {cctv.x}, y {cctv.y}</span>
                <span>{cctv.memo}</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <FitBoundsButton bounds={bounds} />
        <MoveToSelected selectedTarget={selectedTarget} />
        <MapClickLogger devMode={devMode} onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}
