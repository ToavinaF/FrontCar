// App.jsx or Map.jsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L, { divIcon, point } from 'leaflet';
import { Form } from 'react-bootstrap';
import './Map.scss'; // Assurez-vous que ce fichier est bien importé
import IconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import IconUrl from 'leaflet/dist/images/marker-icon.png';
import ShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import MarkerClusterGroup from 'react-leaflet-cluster';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: IconRetinaUrl,
  iconUrl: IconUrl,
  shadowUrl: ShadowUrl,
});
// Custom hook to center map
const MapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 6);
    }
  }, [center, map]);
  return null;
};

const Map = () => {
  const [maps, setMaps] = useState([]);
  const [center, setCenter] = useState([-18.9206054, 47.5197284]);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reservations');
      setMaps(response.data);
      if (response.data.length > 0) {
        setCenter([response.data[0].client.map.latitude, response.data[0].client.map.longitude]);
      }
    } catch (error) {
      console.error('Error fetching maps:', error);
    }
  };

  return (
    <div className="map">
      <MapContainer
        center={center}
        zoom={6}
        minZoom={6}
        maxBounds={[
          [-26.0, 42.0],
          [-11.0, 51.0],
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          <MapCenter center={center} />
          {maps.map((reservation) => {
            const map = reservation.client?.map;
            if (map) {
              return (
                <Marker key={reservation.id} position={[map.latitude, map.longitude]}>
                  <Popup>
                    <div>
                      <strong>Client: {reservation.client.name}</strong><br />
                      
                      <strong>Matricule: {reservation.vehicule.matricule}</strong><br />
                      Latitude: {map.latitude}<br />
                      Longitude: {map.longitude}
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default Map;
