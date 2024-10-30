

import React, { useState } from 'react';
import { register } from '../api'; 


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ email, password });
      alert(response.data.message);
    
    } catch (error) {
      alert(error.response?.data?.error || 'Registrering misslyckades.');
    }
  };

  return (
   
    <form className="register-form container" onSubmit={handleSubmit}>
      <h2>Registrera dig</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Lösenord" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Registrera</button>
    </form>
  );
};

export default Register;
