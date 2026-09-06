import { useEffect, useMemo, useState } from 'react';
import MapViewer from './components/MapViewer.jsx';
import Sidebar from './components/Sidebar.jsx';
import Legend from './components/Legend.jsx';

const IMAGE_SIZE = {
  width: 1254,
  height: 704
};

export default function App() {
  const [cctvList, setCctvList] = useState([]);
  const [mapLayers, setMapLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState('blue');
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [devMode, setDevMode] = useState(false);
  const [lastClick, setLastClick] = useState(null);

  useEffect(() => {
   // fetch('/data/cctv.json')
    fetch(`${import.meta.env.BASE_URL}data/cctv.json`)
      .then((response) => response.json())
      .then(setCctvList)
      .catch((error) => console.error('CCTV 데이터를 불러오지 못했습니다.', error));

    //fetch('/data/mapLayers.json')
    fetch(`${import.meta.env.BASE_URL}data/mapLayers.json`)
      .then((response) => response.json())
      .then(setMapLayers)
      .catch((error) => console.error('지도 레이어 데이터를 불러오지 못했습니다.', error));
  }, []);

  const selectedLayer = useMemo(() => {
    return mapLayers.find((layer) => layer.id === selectedLayerId) ?? mapLayers[0];
  }, [mapLayers, selectedLayerId]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <h1>서귀포시 불법주정차 단속구간</h1>
          <p>이미지 기반 조회용 지도입니다. 위치명과 CCTV 번호는 추후 수정할 수 있습니다.</p>
        </div>
        <div className="top-actions">
          <label className="dev-toggle">
            <input
              type="checkbox"
              checked={devMode}
              onChange={(event) => setDevMode(event.target.checked)}
            />
            좌표 확인 모드
          </label>
        </div>
      </header>

      <main className="main-layout">
        <Sidebar
          cctvList={cctvList}
          mapLayers={mapLayers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onSelectTarget={setSelectedTarget}
          selectedLayer={selectedLayer}
          lastClick={lastClick}
        />

        <section className="map-section">
          <MapViewer
            imageSize={IMAGE_SIZE}
            selectedLayer={selectedLayer}
            cctvList={cctvList}
            selectedTarget={selectedTarget}
            devMode={devMode}
            onMapClick={setLastClick}
          />
          <Legend selectedLayer={selectedLayer} />
        </section>
      </main>
    </div>
  );
}
