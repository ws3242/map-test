import { useEffect, useMemo, useState } from 'react';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar';
import Legend from './components/Legend';
import './styles.css';

const IMAGE_SIZE = {
  width: 1254,
  height: 704
};

function App() {
  const [layers, setLayers] = useState([]);
  const [cctvs, setCctvs] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState('blue');
  const [selectedCctv, setSelectedCctv] = useState(null);
  const [coordinateMode, setCoordinateMode] = useState(false);
  const [lastCoordinate, setLastCoordinate] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl = import.meta.env.BASE_URL;

        const layersResponse = await fetch(`${baseUrl}data/mapLayers.json`);
        const cctvResponse = await fetch(`${baseUrl}data/cctv.json`);

        if (!layersResponse.ok) {
          throw new Error('mapLayers.json 파일을 불러오지 못했습니다.');
        }

        if (!cctvResponse.ok) {
          throw new Error('cctv.json 파일을 불러오지 못했습니다.');
        }

        const layersData = await layersResponse.json();
        const cctvData = await cctvResponse.json();

        setLayers(Array.isArray(layersData) ? layersData : []);
        setCctvs(Array.isArray(cctvData) ? cctvData : []);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.');
      }
    }

    loadData();
  }, []);

  const selectedLayer = useMemo(() => {
    if (!layers.length) {
      return null;
    }

    return layers.find((layer) => layer.id === selectedLayerId) || layers[0];
  }, [layers, selectedLayerId]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-title">
          <h1>서귀포시 불법주정차 단속구간</h1>
          <p>이미지 기반 조회용 지도입니다. 위치명과 CCTV 번호는 추후 수정할 수 있습니다.</p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="menu-toggle-button"
            onClick={() => setSidebarOpen((current) => !current)}
          >
            {sidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
          </button>

          <label className="coordinate-toggle">
            <input
              type="checkbox"
              checked={coordinateMode}
              onChange={(event) => setCoordinateMode(event.target.checked)}
            />
            좌표 확인 모드
          </label>
        </div>
      </header>

      <main className={`app-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar
          isOpen={sidebarOpen}
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          selectedLayer={selectedLayer}
          cctvs={cctvs}
          onSelectCctv={(cctv) => {
            setSelectedCctv(cctv);

            if (window.innerWidth <= 768) {
              setSidebarOpen(false);
            }
          }}
          coordinateMode={coordinateMode}
          lastCoordinate={lastCoordinate}
        />

        <section className="map-section">
          {loadError ? (
            <div className="map-message error-message">{loadError}</div>
          ) : selectedLayer ? (
            <MapViewer
              imageSize={IMAGE_SIZE}
              selectedLayer={selectedLayer}
              cctvs={cctvs}
              selectedCctv={selectedCctv}
              coordinateMode={coordinateMode}
              onCoordinatePick={setLastCoordinate}
            />
          ) : (
            <div className="map-message">지도 데이터를 불러오는 중입니다.</div>
          )}

          <Legend />
        </section>
      </main>
    </div>
  );
}

export default App;
