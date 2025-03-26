import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash, FiEdit, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string; // Changed to string to handle phone numbers with special characters like '+'
  role?: string;
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: '' });
  const [showInputFields, setShowInputFields] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
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

  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    if (newUser.name && newUser.email && newUser.role && newUser.phone) {
      try {
        const response = await axios.post(
          'http://197.248.122.31:3000/api/add-user',
          {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers([...users, { ...newUser, id: response.data.userId }]);
        setNewUser({ name: '', email: '', phone: '', role: '' });
        setShowInputFields(false);
        toast.success('User added successfully');
      } catch (error) {
        console.error('Error adding user:', error);
        toast.error('Error adding user');
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
      toast.error('Error deleting user');
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || '',
    });
    setShowInputFields(true);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');
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

        // Merge the updated fields with the existing user data
        setUsers(
          users.map((user) =>
            user.id === editUser.id
              ? { ...user, ...newUser } // Merge existing user data with updated fields
              : user
          )
        );

        setEditUser(null);
        setNewUser({ name: '', email: '', phone: '', role: '' });
        setShowInputFields(false);
        toast.success('User updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Error updating user');
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div>
      <div className='flex items-center justify-between py-6'>
      <h1 className='text-2xl font-bold mb-5'>Users</h1>
        <div className='flex items-center justify-center w-full'>
          {/* <FiSearch className='mr-2' /> */}
          <input
            type='text'
            placeholder='Search by User Name'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border p-2 items-center rounded w-64'
          />
        </div>
      </div>
      <div className='py-2'>
        <button
          onClick={() => {
            setShowInputFields(true);
            setNewUser({ name: '', email: '', phone: '', role: '' });
            setEditUser(null);
          }}
          className='bg-blue-500 text-black rounded-full px-2 py-1 cursor-pointer flex items-center'
        >
          <FiPlus className='mr-1' /> Add User
        </button>
        </div>

        { loading ? (
          <Skeleton height={10} count={20} /> // Skeleton component for loading animation
        ) : (
          <table className='min-w-full bg-white text-center'>
              <thead>
                <tr className='bg-gray-400'>
                  <th className='py-2 px-4 border-b'>Name</th>
                  <th className='py-2 px-4 border-b'>Email</th>
                  <th className='py-2 px-4 border-b'>Phone</th>
                  <th className='py-2 px-4 border-b'>Institution Name</th>
                  <th className='py-2 px-4 border-b'>Role</th>
                  <th className='py-2 px-4 border-b'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}
                  className={`text-center ${index % 2 === 0 ? 'bg-gray-200' : ''}`}
                  >
                    <td className='py-2 px-4'>{user.name}</td>
                    <td className='py-2 px-4'>{user.email}</td>
                    <td className='py-2 px-4'>{user.phone}</td>
                    <td className='py-2 px-4'>{user.institution_name}</td>
                    <td className='py-2 px-4'>{user.role}</td>
                    <td className='py-2 px-4'>
                      <div className='flex justify-center space-x-2'>
                        <button
                          onClick={() => handleEditUser(user)}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          <FiEdit size={20} title='Edit' />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <FiTrash size={20} title='Delete' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )
      }
      <div className='my-3' ref={inputRef}>
        {showInputFields ? (
          <>
            <input
              type='text'
              placeholder='User Name'
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className='border p-2 rounded m-1'
            />
            <input
              type='email'
              placeholder='Email'
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className='border p-2 rounded m-1'
            />
            <input
              type='text' // Changed from 'number' to 'text' to handle phone numbers with special characters
              placeholder='Phone Number'
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className='border p-2 rounded m-1'
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className='border p-2 rounded m-1'
            >
              <option value='' disabled>
                Select Role
              </option>
              <option value='admin'>Admin</option>
              <option value='user'>User</option>
            </select>
            {editUser ? (
              <button
                onClick={handleSaveEdit}
                className='bg-blue-500 text-black p-2 rounded flex items-center'
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleAddUser}
                className='bg-blue-500 text-black p-2 rounded flex items-center'
              >
                Save User
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Users;