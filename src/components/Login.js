// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../api'; 
import { useNavigate } from 'react-router-dom'; 

const Login = ({ onLogin }) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log('Försöker logga in med e-post:', email); 
        try {
            const response = await login({ email, password });
            console.log('Inloggning lyckades:', response); 
            localStorage.setItem('token', response.data.token); 
            localStorage.setItem('email', email); 
            onLogin(); 
            navigate('/meetups'); 
            console.log('Navigerar till meetups-sidan.');
        } catch (err) {
            console.error("Inloggningsfel:", err); 
            setError(err.response ? err.response.data.error : "Det gick inte att logga in. Försök igen.");
        }
    };

    return (
        <div className="container">
            <h2>Logga in</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="E-post"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Lösenord"
                    required
                />
                <button type="submit">Logga in</button>
                {error && <p style={{ color: 'red' }}>{error}</p>} 
            </form>
        </div>
    );
};

export default Login;
