import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  RootState } from "../redux/store";
import { getUserProfile, logout } from '../redux/authSlice';
import { store } from '../redux/store';

interface NavbarProps {
  isCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<typeof store.dispatch>();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page
  };
  const authState = useSelector((state: RootState) => state.auth);
  useEffect(()=>{
dispatch(getUserProfile())
  },[dispatch])
// console.log("authState is",authState)

  return (
    <div
      className={`fixed top-0 h-16 bg-white text-black flex items-center justify-between px-6 transition-all duration-300 ${
        isCollapsed ? "left-20 w-[calc(100%-80px)]" : "left-60 w-[calc(100%-240px)]"
      }`}
    >
      <div>
      <h1 className="text-lg font-bold">{authState.user?.name ?? 'Guest'}</h1>
      <p className='text-sm'>{authState.user?.institution_name ?? ""}</p>

      </div>
      <button
        className="px-5 py-2 bg-blue-500 rounded-full cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;