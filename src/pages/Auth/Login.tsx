import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import gameLogo from "../../assets/images/game-logo.png";
import axios from 'axios';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = '/api/admin/login';
    // http://197.248.122.31:3000
    
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          email: formData.email,
          password: formData.password
        }
      });
      const { token: responseToken, user } = response.data;
      localStorage.setItem('token', responseToken);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (error) {
      setFormData({
        ...formData,
        error: 'Invalid email or password'
      });
    }
  };

  return (
    <div className='bg-gray-800 min-h-screen h-full flex justify-center items-center'>
      <form onSubmit={handleLogin} autoComplete='off' className='space-y-9 bg-white rounded p-5 w-[400px] mx-auto'>
        <div className='text-center'>
          <img src={gameLogo} className='h-[90px] mx-auto' alt="game logo" />
          <p className='text-xl font-bold'>Login</p>
        </div>
        {formData.error && <p className='text-red-500 text-center'>{formData.error}</p>}
        <div>
          <p className='text-sm font-bold'>Email Address</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter email'
            className='p-2 w-full rounded border'
          />
        </div>
        <div>
          <p className='text-sm font-bold'>Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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