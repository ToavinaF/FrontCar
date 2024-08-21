import React, { useEffect, useState } from 'react';
import './ListClients.scss';
import { FaRegTrashAlt } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { ImUserPlus } from "react-icons/im";
import { NavLink } from 'react-router-dom';

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [reservationCounts, setReservationCounts] = useState({});


  useEffect(() => {
    // Fetch clients data
    axios.get('http://127.0.0.1:8000/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching clients:', error));

    // Fetch reservation counts
    axios.get('http://127.0.0.1:8000/api/countReservedClient')
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
    const userId = localStorage.getItem('userId');
    try {
        console.log('Suppression du client ID:', id);
        console.log('ID de l\'utilisateur connecté:', userId);

        const response = await axios.delete(`http://127.0.0.1:8000/api/DeleteClient/${id}`, {
            data: { 
                deleted_by: userId // Envoyer l'ID de l'utilisateur qui effectue la suppression
            }
        });

        console.log('Réponse complète du serveur:', response); // Affichez toute la réponse du serveur
        console.log('Données reçues (response.data):', response.data); // Affichez le contenu de response.data
        console.log('Deleted by:', response.data.deleted_by); // Vérifiez l'accès à la valeur de deleted_by

        setClients(clients.filter(client => client.id !== id));
        toast.success(`Suppression du client réussie par l'utilisateur ID: ${response.data.deleted_by}`);
    } catch (error) {
        toast.error("Erreur lors de la suppression du client");
        console.error('Erreur lors de la suppression du client', error);
    }
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
