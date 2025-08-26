export default function Recommendation({ recommendation, reason, confidence, flightInfo, sunInfo }) {
  const scrollToMap = () => {
    const mapSection = document.querySelector('.map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="recommendation-container">
      <h2 className="recommendation-title">Recommended Side</h2>
      <p className="recommendation-text">{recommendation.toUpperCase()}</p>
      
      {reason && (
        <div className="recommendation-reason">
          <p>{reason}</p>
          <div className="confidence-badge">
            Confidence: <span className={`confidence-${confidence}`}>{confidence}</span>
          </div>
        </div>
      )}
      
      {flightInfo && (
        <div className="flight-info">
          <div className="info-item">
            <span className="info-label">Distance:</span>
            <span className="info-value">{flightInfo.distance} km</span>
          </div>
          <div className="info-item">
            <span className="info-label">Duration:</span>
            <span className="info-value">{flightInfo.duration} min</span>
          </div>
          <div className="info-item">
            <span className="info-label">Flight Bearing:</span>
            <span className="info-value">{flightInfo.bearing}°</span>
          </div>
        </div>
      )}
      
      {sunInfo && (
        <div className="sun-info">
          <div className="info-item">
            <span className="info-label">Sun Azimuth:</span>
            <span className="info-value">{sunInfo.azimuth}°</span>
          </div>
          <div className="info-item">
            <span className="info-label">Sun Altitude:</span>
            <span className="info-value">{sunInfo.altitude}°</span>
          </div>
          <div className="info-item">
            <span className="info-label">Daytime:</span>
            <span className="info-value">{sunInfo.isDaytime ? 'Yes' : 'No'}</span>
          </div>
        </div>
      )}

      {/* View Flight Path Button */}
      <div className="map-button-container">
        <button 
          onClick={scrollToMap}
          className="view-map-button"
        >
          🗺️ View Flight Path
        </button>
      </div>
    </div>
  );
}
