import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.scss';
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ApiService from '../../axiosConfig';
import { useDropzone } from 'react-dropzone';

function Register() {
    const { t } = useTranslation();
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [acceptedFiles, setAcceptedFiles] = useState([]);

    const onSubmit = async (data) => {
        if (data.password !== data.password_confirmation) {
            setError(t('register.passwordMismatch'));
            return;
        }

        const formData = new FormData();
        if (acceptedFiles.length > 0) {
            formData.append('photo', acceptedFiles[0]);
        }
        formData.append('name', data.name);
        formData.append('firstname', data.firstname);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
     
console.log(data ,'ajout');
        try {
            const response = await ApiService.post(`/register`, formData);
            console.log('Inscription réussie:', response.data);
            toast.success("Ajout User success");
            navigate('../../Home');
        } catch (error) {
            setError(t('register.error'));
            toast.error("Ajout User error");
            console.error('Erreur lors de l\'inscription:', error.response ? error.response.data : error.message);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleRemoveImage = () => {
        setImage(null);
        setValue('photo', []);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            setAcceptedFiles(acceptedFiles);
            if (acceptedFiles.length > 0) {
                setImage(URL.createObjectURL(acceptedFiles[0]));
            }
        }
    });

    return (
        <div className="container">
            <div className="registration-form">
                <h2 className="text-center"><span>{t('register.title')}</span></h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-fields">
                        <div className="form-group">
                            <label htmlFor="photo" className="photo-label">

                            <div {...getRootProps()} className="dropzone">
                            <FaPlusCircle className="icon" />
                            <input {...getInputProps()} />
                            {image && (
                                <div className="image-preview-container">
                                    <img src={image} alt="Preview" className="image-preview" />
                                    <FaTimes className="remove-icon" onClick={handleRemoveImage} />
                                </div>
                            )}
                        </div>
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name"><span>{t('register.name')}</span></label>
                            <input
                                type="text"
                                id="name"
                                className={`form-control ${errors.name ? 'error-border' : ''}`}
                                {...register('name', { required: 'name is Required' })}
                            />
                            {errors.name && <p>{errors.name.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstname"><span>{t('register.firstname')}</span></label>
                            <input
                                type="text"
                                id="firstname"
                                className={`form-control ${errors.firstname ? 'error-border' : ''}`}
                                {...register('firstname', { required: 'firstname is Required' })}
                            />
                            {errors.firstname && <p>{errors.firstname.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email"><span>{t('register.email')}</span></label>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${errors.email ? 'error-border' : ''}`}
                                {...register('email', { required: 'email is Required' })}
                            />
                            {errors.email && <p>{errors.email.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><span>{t('register.password')}</span></label>
                            <input
                                type="password"
                                id="password"
                                className={`form-control ${errors.password ? 'error-border' : ''}`}
                                {...register('password', { required: 'password is Required' })}
                            />
                            {errors.password && <p>{errors.password.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password_confirmation"><span>{t('password.Confirmation')}</span></label>
                            <input
                                type="password"
                                id="password_confirmation"
                                className={`form-control ${errors.password_confirmation ? 'error-border' : ''}`}
                                {...register('password_confirmation', { required: 'password Confirmation is Required' })}
                            />
                            {errors.password_confirmation && <p>{errors.password_confirmation.message}</p>}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-3"><span>{t('register.registerButton')}</span></button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default Register;
