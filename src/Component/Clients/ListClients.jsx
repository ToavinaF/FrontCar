import React, { useEffect, useState } from 'react';
import './ListClients.scss';
import { FaRegTrashAlt } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { ImUserPlus } from "react-icons/im";
import { NavLink } from 'react-router-dom';
import { API_URL } from '../../apiConfig';
import { ApiCall } from '../../ApiCall';

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [reservationCounts, setReservationCounts] = useState({});


  useEffect(() => {
    // Fetch clients data
    ApiCall(`${API_URL}/clients`,'GET')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching clients:', error));

    // Fetch reservation counts
    ApiCall(`${API_URL}/countReservedClient`,'GET')
      .then(response => {
        const counts = response.data.count.reduce((acc, item) => {
          acc[item.id_client] = item.total;
          return acc;
        }, {});
        setReservationCounts(counts);
      })
      .catch(error => console.error('Error fetching reservation counts:', error));
  }, []);
  const handleDeleteClick = async (id) => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      toast.error('Utilisateur non connecté');
      return;
    }

          await ApiCall(`${API_URL}/clients/${id}`,'DELETE', {
          deletedBy: userId // Envoyer l'ID de l'utilisateur qui effectue la suppression
        });

        setClients(clients.filter(client => client.id !== id));
        toast.success(`Suppression du client réussie par l'utilisateur ID: ${response.data.deleted_by}`);

};


  return (
    <div className='content-user'>
      <div className='All-user'>
        <h1 className='title-user'>Tous les clients</h1>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Adresse</th>
              <th>Nombre de réservations</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name} {client.firstname}</td>
                <td>{client.email}</td>
                <td>{client.contact}</td>
                <td>{client.Adresse}</td>
                <td>{reservationCounts[client.id] || 0}</td>
                <td>
                  <a href="#" className='trash' aria-label="Delete" onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(client.id);
                  }}>
                    <FaRegTrashAlt />
                  </a>
                  <NavLink to={`/Home/client/${client.id}`} className='nav_item'>
                    <ImUserPlus className='trash' />
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListClients;
