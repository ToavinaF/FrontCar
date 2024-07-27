import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllUser.scss';
import { FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

    const handleEditClick = (id) => {
        navigate(`/EditUser/${id}`); // Use navigate to redirect
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
                {allUserData.map((user) => (
                    <div
                        key={user.id}
                        className="user-card"
                        onMouseEnter={() => handleMouseEnter(user.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {hoveredUserId === user.id && (
                            <div
                                className="edit-profile"
                                onClick={() => handleEditClick(user.id)}
                            >
                                <FaEdit /> {t('allUser.editProfile')}
                            </div>
                        )}
                        <div className="user-card-header">
                            <div className="user-info">
                                <span>{user.name} {user.firstname}</span>
                                <p><span>{t('allUser.job')}: {user.Job}</span></p>
                                <p><span>{t('allUser.role')}: {user.Role}</span></p>
                            </div>
                            <div className="user-image">
                                <img src={`http://127.0.0.1:8000/storage/${user.photo}`} alt={user.name} />
                            </div>
                        </div>
                        <div className="user-card-body">
                            <p><span><FaPhone /> {user.contact}</span></p>
                            <p><span><FaEnvelope /> {user.email}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUser;
