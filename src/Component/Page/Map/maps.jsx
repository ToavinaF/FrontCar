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

// Fix Marker icon issues with Webpack and Leaflet
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
      map.setView(center, 6); // Ajuste le zoom pour Madagascar
    }
  }, [center, map]);
  return null;
};

const Map = () => {
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [center, setCenter] = useState([-18.9206054, 47.5197284]);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    const filtered = reservations.filter((reservation) =>
      reservation.client.map.marque.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReservations(filtered);

    if (filtered.length > 0) {
      setCenter([filtered[0].client.map.latitude, filtered[0].client.map.longitude]);
    }
  }, [searchQuery, reservations]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredReservations.length > 0) {
      setCenter([filteredReservations[0].client.map.latitude, filteredReservations[0].client.map.longitude]);
    }
  };

  const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: 'custom-marker-cluster',
      iconSize: point(33, 33, true)
    });
  };

  return (
    <div className='map'>
      {/* Champ de recherche */}
      <Form onSubmit={handleSearchSubmit}>
        <Form.Control
          type="text"
          placeholder="Rechercher une réservation"
          value={searchQuery}
          onChange={handleSearch}
          style={{ margin: '10px 0' }}
        />
      </Form>

      <MapContainer
        center={center}
        zoom={6} // Ajustez le niveau de zoom pour Madagascar
        minZoom={6}
        maxBounds={[
          [-26.0, 42.0], // Sud-Ouest de Madagascar
          [-11.0, 51.0], // Nord-Est de Madagascar
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup
          iconCreateFunction={createCustomClusterIcon}
        >
          <MapCenter center={center} />
          {filteredReservations.map(reservation => (
            <Marker key={reservation.id} position={[reservation.client.map.latitude, reservation.client.map.longitude]}>
              <Popup>
                <div>
                  <strong>{reservation.client.name}</strong><br />
                  <strong>{reservation.client.firstname}</strong><br />
                  <strong>{reservation.client.map.marque}</strong><br />
                  Latitude: {reservation.client.map.latitude}<br />
                  Longitude: {reservation.client.map.longitude}<br />
                  Date de début: {reservation.DateDebut}<br />
                  Date de fin: {reservation.DateFin}<br />
                  Prix total: {reservation.PriceTotal}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default Map;
