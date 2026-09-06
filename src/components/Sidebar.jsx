export default function Sidebar({
  cctvList,
  mapLayers,
  selectedLayerId,
  onSelectLayer,
  onSelectTarget,
  selectedLayer,
  lastClick
}) {
  return (
    <aside className="sidebar">
      <section className="panel">
        <h2>지도 선택</h2>
        <div className="layer-list">
          {mapLayers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              className={layer.id === selectedLayerId ? 'layer-button active' : 'layer-button'}
              disabled={!layer.available}
              onClick={() => onSelectLayer(layer.id)}
            >
              <span>{layer.name}</span>
              <small>{layer.available ? '사용 가능' : '추가 예정'}</small>
            </button>
          ))}
        </div>
      </section>

      {selectedLayer && (
        <section className="panel schedule-panel">
          <h2>단속 시간</h2>
          <dl>
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

      <section className="panel">
        <h2>CCTV 목록</h2>
        <p className="panel-note">목록을 클릭하면 해당 위치로 이동합니다. 명칭은 임시값입니다.</p>
        <div className="cctv-list">
          {cctvList.map((cctv) => (
            <button
              key={cctv.id}
              type="button"
              className="cctv-button"
              onClick={() => onSelectTarget(cctv)}
            >
              <span>{cctv.name}</span>
              <small>x {cctv.x}, y {cctv.y}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel coordinate-panel">
        <h2>좌표 확인</h2>
        {lastClick ? (
          <code>{`{ "x": ${lastClick.x}, "y": ${lastClick.y} }`}</code>
        ) : (
          <p className="panel-note">상단의 좌표 확인 모드를 켠 뒤 지도 위를 클릭하면 이미지 좌표가 표시됩니다.</p>
        )}
      </section>
    </aside>
  );
}
