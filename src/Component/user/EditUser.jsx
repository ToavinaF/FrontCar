import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaPlusCircle, FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import "./EditUser.scss";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/user/${id}`);
                const data = response.data;
                setValue("name", data.name);
                setValue("firstname", data.firstname);
                setValue("email", data.email);
                setValue("Job", data.Job || "");
                setValue("contact", data.contact || "");
                setValue("Role", data.Role || "");
                setImage(data.photo ? `http://127.0.0.1:8000/storage/${data.photo}` : null);
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
        const formData = new FormData();
        if (acceptedFiles.length > 0) {
            formData.append('photo', acceptedFiles[0]);
        }
        formData.append('name', data.name);
        formData.append('firstname', data.firstname);
        formData.append('email', data.email);
        formData.append('password', data.password || ''); // Ajouter le mot de passe uniquement s'il est fourni
        formData.append('Job', data.Job);
        formData.append('contact', data.contact);
        formData.append('Role', data.Role);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/updateUser/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Réponse :', response.data);
            navigate('/');
        } catch (error) {
            console.error('Erreur :', error.response ? error.response.data : error.message);
        }
    };

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
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="Job">Job:</label>
                    <input
                        id="Job"
                        type="text"
                        {...register("Job")}
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
                    />
                </div>

               

                <div className="form-group">
                    <label htmlFor="Role">
                        <FaUser /> Role:
                    </label>
                    <select
                        id="Role"
                        {...register("Role", { required: "Role is required" })}
                        className="role-select"
                    >
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {errors.Role && <p>{errors.Role.message}</p>}
                </div>

                <button type="submit" className="btn-save">Save Changes</button>
            </form>
        </div>
    );
};

export default EditUser;
