import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Login.scss';
import { IoCarSport } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../../TokenContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isToken, setIsToken] = useContext(TokenContext); // Assurez-vous que TokenContext est bien configuré

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.data && response.data.access_token) {
                setIsToken(true);
                localStorage.setItem('accessToken', response.data.access_token);
                console.log('Access_Token:', response.data.access_token);
                localStorage.setItem('userName', response.data.userName); // Stockez le nom de l'utilisateur
                localStorage.setItem('role', response.data.Role); // Stockez le rôle de l'utilisateur
                localStorage.setItem('email', response.data.userEmail); // Stockez l'email de l'utilisateur
                localStorage.setItem('contact', response.data.contact); // Stockez les autres données utilisateur
                localStorage.setItem('Job', response.data.Job);
                localStorage.setItem('photo', response.data.photo);
                localStorage.setItem('firstname', response.data.userFirstname);

                // Rediriger vers la page d'accueil ou autre page protégée
                navigate('/home');
            } else {
                setError('Invalid login details');
            }
        } catch (error) {
            console.error('Login Error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Something went wrong. Please try again.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className='content-login'>
            <div className="cont-log">
                <div className="logo">
                    <div className="cont-logo">
                        <IoCarSport className='icon_logo' />
                        <h1>Car</h1>
                    </div>
                    <h2>Sign in to your account</h2>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="inp-lab">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inp-lab">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="inp-rem">
                        <div className="chek-rem">
                            <input type="checkbox" />
                            <p>Remember my preference</p>
                        </div>
                        <div className="forgmy">
                            <a href="#">Forgot Password?</a>
                        </div>
                    </div>
                    <div className="inp-lab">
                        <button type='submit'>Sign Me in</button>
                    </div>
                    <div className="signup">
                        <p>Don't have an account? <a href="/register">Sign Up</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
