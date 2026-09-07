function Sidebar({
  isOpen,
  layers = [],
  selectedLayerId,
  onSelectLayer,
  selectedLayer,
  cctvs = [],
  onSelectCctv,
  coordinateMode,
  lastCoordinate
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-scroll">
        <section className="panel">
          <h2>지도 선택</h2>

          <div className="layer-list">
            {layers.map((layer) => (
              <button
                key={layer.id}
                type="button"
                className={`layer-button ${selectedLayerId === layer.id ? 'active' : ''}`}
                onClick={() => {
                  if (layer.available) {
                    onSelectLayer(layer.id);
                  }
                }}
                disabled={!layer.available}
              >
                <span>{layer.name}</span>
                <small>{layer.available ? '사용 가능' : '추가 예정'}</small>
              </button>
            ))}
          </div>
        </section>

        {selectedLayer && (
          <section className="panel">
            <h2>단속 시간</h2>
            <dl className="time-info">
              <div>
                <dt>평일</dt>
                <dd>{selectedLayer.weekdayTime}</dd>
              </div>
              <div>
                <dt>주말·공휴일</dt>
                <dd>{selectedLayer.weekendHolidayTime}</dd>
              </div>
            </dl>
            <p>{selectedLayer.description}</p>
          </section>
        )}

        <section className="panel cctv-panel">
          <h2>CCTV 목록</h2>
          <p>목록을 클릭하면 해당 위치로 이동합니다. 명칭은 임시 값입니다.</p>

          <div className="cctv-list">
            {cctvs.map((cctv) => (
              <button
                key={cctv.id}
                type="button"
                className="cctv-item"
                onClick={() => onSelectCctv(cctv)}
              >
                <span>{cctv.name}</span>
                <small>
                  x {cctv.x}, y {cctv.y}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>좌표 확인</h2>
          {coordinateMode ? (
            lastCoordinate ? (
              <pre className="coordinate-box">{`{
  "x": ${lastCoordinate.x},
  "y": ${lastCoordinate.y}
}`}</pre>
            ) : (
              <p>지도 위 원하는 위치를 클릭하면 이미지 좌표가 표시됩니다.</p>
            )
          ) : (
            <p>상단의 좌표 확인 모드를 켠 뒤 지도 위를 클릭하면 이미지 좌표가 표시됩니다.</p>
          )}
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;
