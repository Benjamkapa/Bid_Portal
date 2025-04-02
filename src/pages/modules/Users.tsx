import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash, FiEdit } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { GoSearch } from 'react-icons/go';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  institution_name: string;
  role: string;
};

type Institution = {
  id: number;
  institution_name: string;
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', phone: '', institution_id: 0 });
  const [showInputFields, setShowInputFields] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const authState = useSelector((state: RootState) => state.auth);
  const [emailError, setEmailError] = useState<string>("");

  useEffect(() => {
    fetchUsers();
    fetchInstitutions(); // Fetch institutions on mount
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://197.248.122.31:3000/api/all-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get('http://197.248.122.31:3000/api/all-institutions/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setInstitutions(response.data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    // Validate the email before proceeding
    if (!validateEmail(newUser.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (newUser.name && newUser.email && newUser.phone) {
      try {
        const response = await axios.post(
          'http://197.248.122.31:3000/api/add-user',
          {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setNewUser({ name: '', email: '', phone: '' });
        setShowInputFields(false);
        setIsAdmin(false);
        toast.success('User added successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error adding user:', error);
        toast.error('Error adding user');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleAddAdmin = async () => {
    const token = localStorage.getItem('token');
    // Validate the email before proceeding
    if (!validateEmail(newAdmin.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (newAdmin.name && newAdmin.email && newAdmin.phone && newAdmin.institution_id) {
      try {
        const response = await axios.post(
          'http://197.248.122.31:3000/api/add-admin',
          {
            name: newAdmin.name,
            email: newAdmin.email,
            phone: newAdmin.phone,
            institution_id: newAdmin.institution_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setNewAdmin({ name: '', email: '', phone: '', institution_id: 0 });
        setShowInputFields(false);
        setIsAdmin(false);
        toast.success('Admin added successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error adding admin:', error);
        toast.error('Error adding admin');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDeleteUser = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://197.248.122.31:3000/api/delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting data');
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setShowInputFields(true);
    setIsAdmin(false);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');
    // Validate the email before proceeding
    if (!validateEmail(newUser.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (editUser) {
      try {
        const response = await axios.put(
          `http://197.248.122.31:3000/api/edit-user/${editUser.id}`,
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(users.map((user) => (user.id === editUser.id ? response.data : user)));
        setEditUser(null);
        setNewUser({ name: '', email: '', phone: '' });
        setShowInputFields(false);
        toast.success('User updated successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Error updating user');
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRole = () => {
    let role = '';
    switch (authState.user?.role) {
      case 'super_admin':
        role = 'Super Admin';
        break;
      case 'admin':
        role = 'Admin';
        break;
      case 'user':
        role = 'User';
        break;
      default:
        break;
    }
    return role;
  };

  // Simple email validation that checks if the email contains "@" symbol anywhere
  const validateEmail = (email: string) => {
    if (email.includes('@')) {
      setEmailError(""); // Clear any previous error if the email is valid
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold mb-5">Users</h1>
        <div className="flex items-center justify-center w-full">
          <input
            type="text"
            placeholder="Search by User Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 items-center rounded w-64"
          />
          <GoSearch size={23} className="relative top-.5 right-8" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="py-2 flex">
        <button
          onClick={() => {
            setShowInputFields(true);
            setNewUser({ name: '', email: '', phone: '' });
            setEditUser(null);
            setIsAdmin(false);
          }}
          className="bg-blue-500 text-black rounded-full px-2 py-1 cursor-pointer flex items-center hover:bg-blue-400"
        >
          <FiPlus className="mr-1" /> Add User
        </button>
        {/* Conditionally render the Add Admin button */}
        {formatRole() === 'Super Admin' && (
          <button
            onClick={() => {
              setShowInputFields(true);
              setIsAdmin(true);
              setNewAdmin({ name: '', email: '', phone: '', institution_id: 0 });
              setEditUser(null);
            }}
            className="bg-[#DA67D9] text-black rounded-full px-2 py-1 cursor-pointer flex items-center ml-4 hover:bg-[rgb(218,103,217,.8)]"
          >
            <FiPlus className="mr-1" /> Add Admin
          </button>
        )}
      </div>

      {/* Table of Users */}
      {loading ? (
        <Skeleton height={10} count={40} />
      ) : (
        <table className="min-w-full bg-white text-center">
          <thead>
            <tr className="bg-[rgb(92,72,155,0.9)]">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Institution Name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className={`text-center ${index % 2 !== 0 ? 'bg-[rgb(92,72,155,0.3)]' : ''}`}>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4">{user.institution_name}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit size={20} title="Edit" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash size={20} title="Delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* User/Admin Form */}
      <div className="my-3 pt-2" ref={inputRef}>
        {showInputFields && (
          <>
            {isAdmin ? (
              <>
                <input
                  type="text"
                  placeholder="Admin Name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="border p-1 rounded m-1"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="border p-1 rounded m-1"
                />
                {emailError && <span className="text-red-500 text-xs">{emailError}</span>}
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  className="border p-1 rounded m-1"
                />
                <select
                  value={newAdmin.institution_id}
                  onChange={(e) => setNewAdmin({ ...newAdmin, institution_id: parseInt(e.target.value) })}
                  className="border p-1 rounded m-1"
                >
                  <option value={0} disabled>Select Institution</option>
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.institution_name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddAdmin}
                  className="bg-[#DA67D9] py-2 px-4 rounded ml-2 hover:bg-[rgb(218,103,217,.8)]"
                >
                  Save Admin
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="border p-1 rounded m-1"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="border p-1 rounded m-1"
                />
                {emailError && <span className="text-red-500 text-xs">{emailError}</span>}
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="border p-1 rounded m-1"
                />
                <button
                  onClick={editUser ? handleSaveEdit : handleAddUser}
                  className="bg-blue-500 py-2 px-4 rounded ml-2 hover:bg-blue-400"
                >
                  {editUser ? 'Save Edit' : 'Save User'}
                </button>
              </>
            )}
          </>
        )}
      </div>  
    </div>
  );
};

export default Users;
