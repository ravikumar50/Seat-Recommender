import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import L from 'leaflet';

const MapComponent = ({ path, sunPositions }) => {
  useEffect(() => {
    const map = L.map('map').setView([path[0].lat, path[0].lon], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const latlngs = path.map(p => [p.lat, p.lon]);
    L.polyline(latlngs, { color: 'blue' }).addTo(map);
    sunPositions.forEach(pos => {
      L.circleMarker([pos.lat, pos.lon], {
        radius: 3,
        color: pos.altitude > 0 ? 'yellow' : 'gray'
      }).addTo(map);
    });

    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: 12px; min-width: 150px;">
          <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Flight Map Legend</h4>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 4px; background: blue; margin-right: 8px;"></div>
            <span>Flight Path</span>
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 12px; height: 12px; background: yellow; border-radius: 50%; margin-right: 8px; border: 1px solid #ccc;"></div>
            <span>Daytime Sun</span>
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 12px; height: 12px; background: gray; border-radius: 50%; margin-right: 8px; border: 1px solid #ccc;"></div>
            <span>Nighttime Sun</span>
          </div>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    return () => map.remove();
  }, [path, sunPositions]);

  return <div id="map" style={{ height: '600px', width: '90%', margin: '0 auto' }} />;
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
