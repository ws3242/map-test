export default function Legend({ selectedLayer }) {
  return (
    <div className="legend" aria-label="지도 범례">
      <div className="legend-title">범례</div>
      <div className="legend-row">
        <span className="legend-line blue-line" />
        <span>파란색 도로: 평일 07:30 ~ 19:00</span>
      </div>
      <div className="legend-row">
        <span className="legend-line red-line" />
        <span>빨간색 도로: 평일 07:30 ~ 21:00, 추가 예정</span>
      </div>
      <div className="legend-row">
        <span className="legend-camera" />
        <span>빨간색 원: CCTV 클릭 위치</span>
      </div>
      <div className="legend-row subtle">
        <span>주말·공휴일: 09:00 ~ 18:00</span>
      </div>
      {selectedLayer && (
        <div className="legend-current">현재 지도: {selectedLayer.name}</div>
      )}
    </div>
  );
}
