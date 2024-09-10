import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllUser.scss';
import { FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { API_URL, BASE_URL } from '../../apiConfig';
import ApiService from '../../axiosConfig';
import Loader from '../Page/loader/Loader';

const AllUser = ({ searchTerm, ResultSearch }) => {
    const { t } = useTranslation();
    const [allUserData, setAllUserData] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();
    const loggedInUserId = localStorage.getItem('id');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await ApiService.get(`/users`);
            const filteredUsers = response.data.filter(user => user.id !== parseInt(loggedInUserId));
            setAllUserData(filteredUsers);
        } catch (error) {
            console.log('Vérifiez le code');
        }
    };
    // const filteredUsers = allUserData.filter(user => {
    //     return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    //             user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             user.email.toLowerCase().includes(searchTerm.toLowerCase());
    // });

    const handleCardClick = (id) => {
        setSelectedUserId(id === selectedUserId ? null : id);
    };
    const handleDeleteClick = async (id) => {
        try {

            await ApiService.delete(`/deleteUser/${id}`);


            setAllUserData(allUserData.filter(user => user.id !== id));
            toast.success("Delete User success");

        } catch (error) {
            toast.error("Delete User error");
            console.log('Erreur lors de la suppression de l\'utilisateur', error);
        }
    };

    const handleEditClick = (id) => {
        navigate('/Home/editUser/' + id);
    };


    return (
        <div className="user-list">
            <header className="header">
                <h1><span>{t('allUser.title')}</span></h1>
            </header>
            <div className="project-stats">
                <button className="btn">{t('allUser.allUsers')}</button>
            </div>
            <div className="user-cards">
                {
                    ResultSearch ? (
                        <>
                            {ResultSearch.map((user) => (
                                <div
                                    key={user.id}
                                    className="user-card"
                                    onClick={() => handleCardClick(user.id)}
                                >
                                    {selectedUserId === user.id && (
                                        <div className="user-actions">
                                            <div
                                                className="edit-profile"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(user.id);
                                                }}
                                            >
                                                <FaEdit /> {t('Edit Profile')}
                                            </div>
                                            <div
                                                className="delete-profile"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(user.id);
                                                }}
                                            >
                                                <MdDelete /> {t('Delete Profile')}
                                            </div>
                                        </div>
                                    )}
                                    <div className="card-header d-flex align-items-center justify-content-between">
                                        <div className="user-info">
                                            <h5 className="card-title">{user.name} {user.firstname}</h5>
                                            <p className="card-text">{t('allUser.job')}: {user.Job}</p>
                                            <p className="card-text">{t('allUser.role')}: {user.Role}</p>
                                        </div>
                                        <div className="user-image">
                                            <img src={`${API_URL}/viewimage/${user.photo}`} alt={user.name} className="rounded-circle border border-white" />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text"><FaPhone /> {user.contact}</p>
                                        <p className="card-text"><FaEnvelope /> {user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {allUserData.map((user) => (
                                <div
                                    key={user.id}
                                    className="user-card"
                                    onClick={() => handleCardClick(user.id)}
                                >
                                    {selectedUserId === user.id && (
                                        <div className="user-actions">
                                            <div
                                                className="edit-profile"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(user.id);
                                                }}
                                            >
                                                <FaEdit /> {t('Edit Profile')}
                                            </div>
                                            <div
                                                className="delete-profile"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(user.id);
                                                }}
                                            >
                                                <MdDelete /> {t('Delete Profile')}
                                            </div>
                                        </div>
                                    )}
                                    <div className="card-header d-flex align-items-center justify-content-between">
                                        <div className="user-info">
                                            <h5 className="card-title">{user.name} {user.firstname}</h5>
                                            <p className="card-text">{t('allUser.job')}: {user.Job}</p>
                                            <p className="card-text">{t('allUser.role')}: {user.Role}</p>
                                        </div>
                                        <div className="user-image">
                                            <img src={`${API_URL}/viewimage/${user.photo}`} alt={user.name} className="rounded-circle border border-white" />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text"><FaPhone /> {user.contact}</p>
                                        <p className="card-text"><FaEnvelope /> {user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default AllUser;
