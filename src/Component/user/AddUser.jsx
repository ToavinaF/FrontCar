import React, { useState } from 'react';
import './AddUser.scss';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        firstName: '',
        password: '',
        email: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        console.log(formData);
    };

    return (
        <div className="container">
            <div className="registration-form">
                <h2 className="text-center">Inscription</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-fields">
                        <div className="form-group">
                            <label htmlFor="name">Nom</label> <br />
                            <input 
                                type="text" 
                                className="form-control" 
                                id="name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">Prénom</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="firstName" 
                                name="firstName" 
                                value={formData.firstName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Image</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                id="image" 
                                name="image" 
                                onChange={handleImageChange} 
                                required 
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-3">S'inscrire</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
