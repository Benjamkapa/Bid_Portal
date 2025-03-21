import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import gameLogo from "../../assets/images/game-logo.png";
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = 'http://197.248.122.31:3000/api/auth/login';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJOT1JNQUwiLCJpYXQiOjE3NDI1NDE2NzQsImV4cCI6MTc0MjYyODA3NH0.tVPyN3FN29OcJn-uxrt7xADfqvNUi6olqGEp2ZA_OjE';
    
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: {
          email,
          password
        }
      });
      const { token: responseToken, user } = response.data;
      localStorage.setItem('token', responseToken);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='bg-gray-800 min-h-screen h-full flex justify-center items-center'>
      <form onSubmit={handleLogin} autoComplete='off' className='space-y-9 bg-white rounded p-5 w-[400px] mx-auto'>
        <div className='text-center'>
          <img src={gameLogo} className='h-[90px] mx-auto' alt="game logo" />
          <p className='text-xl font-bold'>Login</p>
        </div>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <div>
          <p className='text-sm font-bold'>Email Address</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
            className='p-2 w-full rounded border'
          />
        </div>
        <div>
          <p className='text-sm font-bold'>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter password'
            className='p-2 w-full rounded border'
          />
        </div>
        <Button color="bg-[teal]" text="Login" />
        <div className='flex justify-between mt-4'>
          <Link to="/logon" className='text-blue-500'>Create Account</Link>
          <Link to="/forgot-password" className='text-blue-500'>Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;