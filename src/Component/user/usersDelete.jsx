import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './usersDelete.scss';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { MdRestore } from 'react-icons/md';

const UsersDelete = () => {
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedDeletedUserId, setSelectedDeletedUserId] = useState(null);

    useEffect(() => {
        console.log('Récupération des utilisateurs et des utilisateurs supprimés');
        fetchUsers();
        fetchDeletedUsers();
    }, []);

    const fetchUsers = async () => {
        // Implémentez la logique de récupération des utilisateurs si nécessaire
    };

    const fetchDeletedUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/userDelete');
            setDeletedUsers(response.data);
        } catch (error) {
            console.error('Error fetching deleted users', error);
        }
    };

    const handleCardClick = (id, isDeleted = false) => {
        if (isDeleted) {
            setSelectedDeletedUserId(id === selectedDeletedUserId ? null : id);
        } else {
            setSelectedUserId(id === selectedUserId ? null : id);
        }
    };

    const handleEditClick = (id) => {
        // Handle edit logic here
    };

    const handleDeleteClick = async (id) => {
        // Handle delete logic here
    };

    const handleRestoreClick = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/userRestore/${id}`);
            fetchUsers();
            fetchDeletedUsers();
        } catch (error) {
            console.error('Error restoring user', error);
        }
    };

    return (
        <div className="user-cards">
            {deletedUsers.map((user) => (
                <div
                    key={user.id}
                    className="user-card deleted"
                    onClick={() => handleCardClick(user.id, true)}
                >
                    {selectedDeletedUserId === user.id && (
                        <div className="user-actions">
                            <div
                                className="restore-profile"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestoreClick(user.id);
                                }}
                            >
                                <MdRestore /> Restore user
                            </div>
                        </div>
                    )}
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <div className="user-info">
                            <h5 className="card-title">{user.name} {user.firstname}</h5>
                            <p className="card-text">Job: {user.Job}</p>
                            <p className="card-text">Role: {user.Role}</p>
                        </div>
                        <div className="user-image">
                            <img src={`http://127.0.0.1:8000/storage/${user.photo}`} alt={user.name} className="rounded-circle border border-white" />
                        </div>
                    </div>
                    <div className="card-body">
                        <p className="card-text"><FaPhone /> {user.contact}</p>
                        <p className="card-text"><FaEnvelope /> {user.email}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UsersDelete;
