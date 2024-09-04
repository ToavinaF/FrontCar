import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Form } from 'react-bootstrap';
import axios from 'axios';

import './Map.scss';
import IconUrl from 'leaflet/dist/images/marker-icon.png';
import ShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import IconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import { API_URL } from '../../../apiConfig';
import { ApiCall } from '../../../ApiCall';
import ApiService from '../../../axiosConfig';

// Configuration des icônes par défaut pour Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: IconRetinaUrl,
  iconUrl: IconUrl,
  shadowUrl: ShadowUrl,
});

const Map = () => {
  const [maps, setMaps] = useState([]);
  const [center, setCenter] = useState([-18.9206054, 47.5197284]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [ViewMap, setViewMap] = useState([]);

  useEffect(() => {
    fetchMaps();
    mapLocal();
  }, []);

  // Fonction pour récupérer les emplacements à afficher sur la carte
  const mapLocal = async () => {
    try {
      const response = await ApiService.get('viewMap');
      setViewMap(response.data);
      console.log('voiture:', response.data);
      setFilteredReservations(response.data); // Affiche les emplacements par défaut
    } catch (error) {
      console.error('Error fetching maps:', error);
    }
  };

  const fetchMaps = async () => {
    try {
      // const response = await ApiCall(`${API_URL}/reservations`, 'GET');
      const response = await ApiService.get('/reservations')
      setMaps(response.data);
      if (response.data.length > 0) {
        setCenter([response.data[0].client.map.latitude, response.data[0].client.map.longitude]);
      }
    } catch (error) {
      console.error('Error fetching maps:', error);
    }
  };
  const handleMapInteractions = (map) => {
    const popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent(` ${e.latlng.toString()}`)
        .openOn(map);
    }

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
    };
  };

  const MapCenter = () => {
    const map = useMap();

    useEffect(() => {
      if (center) {
        map.setView(center, 6);
      }
      handleMapInteractions(map);
    }, [center, map]);

    return null;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredReservations.length > 0) {
      const bounds = L.latLngBounds(
        filteredReservations.map(reservation => [reservation.map_latitude, reservation.map_longitude])
      );
      map.fitBounds(bounds);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = ViewMap.filter((item) =>
      item.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
      
      item.matricule.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReservations(filtered);

    if (filtered.length > 0) {
      const bounds = L.latLngBounds(
        filtered.map(item => [item.map_latitude, item.map_longitude])
      );
      setCenter(bounds.getCenter());
    } else {
      // Si aucune recherche, réinitialiser à tous les emplacements
      setFilteredReservations(ViewMap);
    }
  }, [searchQuery, ViewMap]);

  return (
    <div className="map">
      <Form onSubmit={handleSearchSubmit}>
        <Form.Control
          type="text"
          placeholder="Rechercher un véhicule"
          value={searchQuery}
          onChange={handleSearch}
          style={{ margin: '10px 0' }}
        />
      </Form>
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
          {filteredReservations.map((item) => {
            const { map_lieu, map_latitude, map_longitude, name, firstname, marque, model, matricule } = item;
            if (map_latitude && map_longitude) {
              return (
                <Marker key={item.id} position={[map_latitude, map_longitude]}>
                  <Popup>
                    <div>
                      <strong>Client: {name} {firstname}</strong><br />
                      <strong>Véhicule: {marque} {model}</strong><br />
                      <strong>Matricule: {matricule}</strong><br/>
                      Lieu: {map_lieu}<br />
                      Latitude: {map_latitude}<br />
                      Longitude: {map_longitude}
                      {item.photo && (
                        <div>
                          <img src={`${API_URL}/viewimage/${item.photo}`} alt="Client" style={{ width: '100px', height: 'auto' }} />
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MarkerClusterGroup>
        <MapCenter />
      </MapContainer>
    </div>
  );
};

export default Map;
