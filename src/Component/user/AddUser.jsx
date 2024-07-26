import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.scss';
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

function Register() {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCn, setPasswordCn] = useState('');
    const [photo, setPhoto] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== passwordCn) {
            setError(t('register.passwordMismatch'));
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('firstname', firstname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', passwordCn); // Ajout de la confirmation du mot de passe
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Inscription réussie:', response.data);
            Navigate('Home')
        } catch (error) {
            setError(t('register.error'));
            console.error('Erreur lors de l\'inscription:', error.response ? error.response.data : error.message);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setPhoto(file);
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleRemoveImage = () => {
        setPhoto(null);
        setImage(null);
    };

    return (
        <div className="container">
            <div className="registration-form">
                <h2 className="text-center">{t('register.title')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-fields">
                        <div className="form-group">
                            <label htmlFor="photo" className="photo-label">
                                <div
                                    className="dropzone"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <input
                                        id="photo"
                                        type="file"
                                        className="form-input"
                                        name="photo"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <FaPlusCircle className="icon" />
                                    {image && (
                                        <div className="image-preview-container">
                                            <img src={image} alt="Preview" className="image-preview" />
                                            <FaTimes className="remove-icon" onClick={handleRemoveImage} />
                                        </div>
                                    )}
                                    {!image && <p>{t('register.profilePhoto')}</p>}
                                </div>
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">{t('register.name')}</label><br />
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstname">{t('register.firstname')}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                name="firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{t('register.email')}</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">{t('register.password')}</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password_confirmation">{t('passwordConfirmation')}</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={passwordCn}
                                onChange={(e) => setPasswordCn(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-3">{t('register.registerButton')}</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
