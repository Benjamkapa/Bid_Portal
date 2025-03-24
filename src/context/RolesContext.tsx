import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const RolesContext = createContext(null);

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        const response = await axios.get('/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
      }
    };

    fetchRolesAndPermissions();
  }, []);

  return (
    <RolesContext.Provider value={roles}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => useContext(RolesContext);