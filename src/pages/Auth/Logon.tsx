import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import gameLogo from "../../assets/images/game-logo.png";
import axios from 'axios';

const Logon: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://197.248.122.31:3000/api/auth/register', {
        name,
        email,
        password,
        phone,
      }, 
      {
        headers: {
          'Content-Type':'application/json',
          // 'Authorization':'Bearer jkhfkjhkfjghkjg'
        }
      }
    );
      const { status, message } = response.data;
      if (status === 1000) {
        setSuccess(message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Registration failed');
      }
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div className='bg-gray-800 min-h-screen h-full flex justify-center items-center'>
      <form onSubmit={handleRegister} autoComplete='off' className='space-y-9 bg-white rounded p-5 w-[400px] mx-auto'>
        <div className='text-center'>
          <img src={gameLogo} className='h-[90px] mx-auto' alt="game logo" />
          <p className='text-xl font-bold'>Create Account</p>
        </div>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        {success && <p className='text-green-500 text-center'>{success}</p>}
        <div>
          <p className='text-sm font-bold'>Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter your name'
            className='p-2 w-full rounded border'
          />
        </div>
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
        <div>
          <p className='text-sm font-bold'>Phone</p>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Enter your phone number'
            className='p-2 w-full rounded border'
          />
        </div>
        <div>
          <p className='text-sm font-bold'>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            className='p-2 w-full rounded border'
          />
        </div>
        <Button color="bg-[teal]" text="Register" />
        <Link to='/login' className='text-center text-blue-500 float-right'>Already have an account</Link>
      </form>
    </div>
  );
};

export default Logon;