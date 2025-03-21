import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import gameLogo from "../../assets/images/game-logo.png";
import axios from 'axios';
import { FiChevronLeft } from 'react-icons/fi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://197.248.122.31:3000/api/auth/forgot-password', {
        email,
      });
      setMessage('Password reset link sent to your email');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError('Failed to send password reset link');
    }
  };

  return (
    <div className='bg-gray-800 min-h-screen h-full flex justify-center items-center'>
      <form onSubmit={handleForgotPassword} autoComplete='off' className='space-y-9 bg-white rounded p-5 w-[400px] mx-auto'>
        <div className='text-center'>
          <img src={gameLogo} className='h-[90px] mx-auto' alt="game logo" />
          <p className='text-xl font-bold'>Forgot Password</p>
        </div>
        {message && <p className='text-green-500 text-center'>{message}</p>}
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <div>
          <p className='text-sm font-bold'>Email Address</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            className='p-2 w-full rounded border'
          />
        </div>
        <Button color="bg-[teal]" text="Send Reset Link" />
        {/* <div className='mt-4'> */}
          <Link to="/login" className='text-blue-500 font-bold'>
          <FiChevronLeft size={20}/>
          </Link>
        {/* </div> */}
      </form>
    </div>
  );
};

export default ForgotPassword;