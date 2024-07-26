import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllUser.scss';
import { FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaDeleteLeft } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

const AllUser = () => {
    const { t } = useTranslation();
    const [allUserData, setAllUserData] = useState([]);
    const [hoveredUserId, setHoveredUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users');
            setAllUserData(response.data);
        } catch (error) {
            console.log('Vérifiez le code');
        }
    };

    const handleMouseEnter = (id) => {
        setHoveredUserId(id);
    };

    const handleMouseLeave = () => {
        setHoveredUserId(null);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/deleteUser/${id}`);
            // Remove the deleted user from the list
            setAllUserData(allUserData.filter(user => user.id !== id));
        } catch (error) {
            console.log('Erreur lors de la suppression de l\'utilisateur', error);
        }
    };
    const handleEditClick = async (id) => {
        navigate('/Home/editUser/'+id)

    };

    return (
        <div className="user-list">
            <header className="header">
                <h1>{t('allUser.title')}</h1>
            </header>
            <div className="project-stats">
                <button className="btn">{t('allUser.allUsers')}</button>
            </div>
            <div className="user-cards">
                {allUserData.map((user) => (
                    <div
                        key={user.id}
                        className="user-card"
                        onMouseEnter={() => handleMouseEnter(user.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {hoveredUserId === user.id && (
                            <div className="user-actions">
                                <div
                                    className="edit-profile"
                                    onClick={() => handleEditClick(user.id)}
                                >
                                    <FaEdit /> {t('allUser.editProfile')}
                                </div>

                                <div
                                    className="delete-profile"
                                    onClick={() => handleDeleteClick(user.id)}
                                >
                                    <MdDelete /> {t('allUser.deleteProfile')}
                                </div>
                            </div>
                        )}
                       <div className="user-card">
    <div className="card-header d-flex align-items-center justify-content-between">
        <div className="user-info">
            <h5 className="card-title">{user.name} {user.firstname}</h5>
            <p className="card-text">{t('allUser.job')}: {user.Job}</p>
            <p className="card-text">{t('allUser.role')}: {user.Role}</p>
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

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUser;
