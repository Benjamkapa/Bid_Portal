import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  RootState } from "../redux/store";
import { getUserProfile, logout } from '../redux/authSlice';
import { store } from '../redux/store';
// import { FiLogOut } from 'react-icons/fi';
import { MdLogout, MdLogin } from 'react-icons/md';

interface NavbarProps {
  isCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<typeof store.dispatch>();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); 
  };
  const authState = useSelector((state: RootState) => state.auth);
  useEffect(()=>{
dispatch(getUserProfile())
  },[dispatch])

// format user role
  const formatRole=()=>{
    let role=""
    switch (authState.user?.role) {
      case "super_admin":
        role="Super Admin"
        break;
      case "admin":
        role= "Admin"
        break
      case "user":
        role="User"  
        break;
      default:
        break;
    }

    return role
  }



  return (
    <div
        className={`fixed top-0 h-16 text-black flex items-center justify-between px-6 transition-all duration-300 
          bg-gradient-to-r from-blue-800 via-violet-300 to-violet-900 ${
            isCollapsed ? "left-18 w-[calc(100%-60px)]" : "left-60 w-[calc(100%-200px)]"
          }`}
      >
      <div>
      <h1 className="text-lg font-bold">{authState.user?.name ?? 'Guest'}</h1>
      <p className='text-sm'>{authState.user?.instituion?.institution_name ?? ""} ({formatRole()})</p>

      </div>
      <button
        onClick={handleLogout}
        title='Logout'
      >
        <MdLogout className="cursor-pointer" size={20}/>
      </button>
    </div>
  );
};

export default Navbar;