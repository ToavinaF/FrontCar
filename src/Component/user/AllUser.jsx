import React, { useState } from 'react';
import axios from "axios";
import "./AllUser.scss";
import Image from "../../assets/46.jpg";
import { FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';

const AllUser = () => {
    // Exemples d'utilisateurs
    const [users] = useState([
        { id: 1, name: 'John Doe', job: 'Developer', role: 'Admin', contact: '123456789', email: 'john@example.com', image: Image },
        { id: 2, name: 'Jane Smith', job: 'Designer', role: 'Editor', contact: '987654321', email: 'jane@example.com', image: Image },
        { id: 3, name: 'Alice Johnson', job: 'Manager', role: 'HR', contact: '555555555', email: 'alice@example.com', image: Image },
        { id: 4, name: 'Aloce Johnson', job: 'Manadger', role: 'HRe', contact: '5555e55555', email: 'alice@eexample.com', image: Image }
   
   
    ]);

    const [hoveredUserId, setHoveredUserId] = useState(null);

    const handleMouseEnter = (id) => {
        setHoveredUserId(id);
    };

    const handleMouseLeave = () => {
        setHoveredUserId(null);
    };

    const handleEditClick = (id) => {
        alert(`Edit Profile clicked for user ${id}`);
    };

    return (
        <div className="user-list">
            <header className="header">
                <h1>Utilisateurs</h1>
            </header>
            <div className="project-stats">
                <button className="btn">Tous les utilisateurs</button>
            </div>
            <div className="user-cards">
                {users.map((user) => (
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
                                <FaEdit /> Edit user
                            </div>
                        )}
                        <div className="user-card-header">
                            <div className="user-info">
                                <span>{user.name}</span>
                                <p>Job: {user.job}</p>
                                <p>Role: {user.role}</p>
                            </div>
                            <div className="user-image">
                                <img src={user.image} alt={user.name} />
                            </div>
                        </div>
                        <div className="user-card-body">
                            <p><FaPhone /> {user.contact}</p>
                            <p><FaEnvelope /> {user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUser;
