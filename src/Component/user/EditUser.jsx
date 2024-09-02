import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaPlusCircle, FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import "./EditUser.scss";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { API_URL, BASE_URL } from "../../apiConfig";
import ApiService from "../../axiosConfig";




const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm();
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const [image, setImage] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const currentLanguageCode = Cookies.get('i18next') || 'en';
    const [role, setRole] = useState('');

    const languages = [
        { code: 'fr', name: 'Français', country_code: 'fr' },
        { code: 'en', name: 'English', country_code: 'gb' }
    ];
    
    useEffect(() => {
        // Récupérer le rôle depuis localStorage et mettre à jour l'état
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ApiService.get(`/user/${id}`);
                const data = response.data;
                setValue("name", data.name);
                setValue("firstname", data.firstname);
                setValue("email", data.email);
                setValue("Job", data.Job || "");
                setValue("contact", data.contact || "");
                setValue("Role", data.Role || "");
                setImage(data.photo ? `${API_URL}/viewimage/${data.photo}` : null);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [id, setValue]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            setAcceptedFiles(acceptedFiles);
            if (acceptedFiles.length > 0) {
                setImage(URL.createObjectURL(acceptedFiles[0]));
            }
        }
    });

    const modify = async (data) => {
        setIsSubmitted(true); // Mark form as submitted
        const isValid = await trigger(); // Trigger validation
        if (!isValid) return; // Exit if there are validation errors

        const formData = new FormData();
        if (acceptedFiles.length > 0) {
            formData.append('photo', acceptedFiles[0]);
        }
        formData.append('name', data.name);
        formData.append('firstname', data.firstname);
        formData.append('email', data.email);
        formData.append('password', data.password || '');
        formData.append('Job', data.Job);
        formData.append('contact', data.contact);
        formData.append('Role', data.Role);

        try {
            const response = await ApiService.post(`/updateUser/${id}`, formData);
            toast.success("modif success", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
            console.log('Réponse :', response.data);

            navigate('/Home');
        } catch (error) {
            toast.error("modif error");
            console.error('Erreur :', error.response ? error.response.data : error.message);

        }
    };
    const handleLanguageChange = (code) => {
        i18next.changeLanguage(code);
        Cookies.set('i18next', code);
        console.log('Language changed to:', code);
    }

    const handleRemoveImage = () => {
        setImage(null);
        setAcceptedFiles([]);
    };

    return (
        <div className="edit-user-form">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit(modify)}>
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
                    <label htmlFor="name">
                        <FaUser /> Name:
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className={`input-field ${errors.name ? 'error-border' : ''}`}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="firstname">
                        <FaUser /> First Name:
                    </label>
                    <input
                        id="firstname"
                        type="text"
                        {...register("firstname", { required: "First name is required" })}
                        className={`input-field ${errors.firstname ? 'error-border' : ''}`}
                    />
                    {errors.firstname && <p>{errors.firstname.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        <FaEnvelope /> Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className={`input-field ${errors.email ? 'error-border' : ''}`}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="Job">Job:</label>
                    <input
                        id="Job"
                        type="text"
                        {...register("Job")}
                        className={`input-field ${errors.Job ? 'error-border' : ''}`}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact">
                        <FaPhone /> Contact:
                    </label>
                    <input
                        id="contact"
                        type="text"
                        {...register("contact")}
                        className={`input-field ${errors.contact ? 'error-border' : ''}`}
                    />
                </div>
                {role === 'superAdmin' && (
                <div className="form-group">
                    <label htmlFor="Role">
                        <FaUser /> Role:
                    </label>
                    <select
                        id="Role"
                        {...register("Role", { required: "Role is required" })}
                        className={`role-select ${errors.Role ? 'error-border' : ''}`}
                    >
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {errors.Role && <p>{errors.Role.message}</p>}
                </div>
                )}
                <div className='li-dash'>
                    <div className='btn-lang'>
                        {languages.map(({ code, name, country_code }) => (
                            <div key={country_code}>
                                <button
                                    onClick={() => handleLanguageChange(code)}
                                    disabled={code === currentLanguageCode}
                                >
                                    <span
                                        className={`flag-icon flag-icon-${country_code}`}
                                        style={{ opacity: code === currentLanguageCode ? 0.5 : 1 }}
                                    ></span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-save">Save Changes</button>
            </form>
        </div>
    );
};

export default EditUser;
