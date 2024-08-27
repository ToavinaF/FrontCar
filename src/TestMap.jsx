import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapEvents() {
  useMapEvents({
    click: (event) => {
      console.log("Map clicked", event.latlng);
    }
  });
  return null;
}

function TestMap() {
  return (
    <div style={{ height: '600px', width: '600px', border: '1px solid black' }}>
      <MapContainer
        center={[-18.8792, 47.5079]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
      </MapContainer>
    </div>
  );
}

export default TestMap;
