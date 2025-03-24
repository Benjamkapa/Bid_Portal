import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiTrash, FiEdit, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [showInputFields, setShowInputFields] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.example.com/users'); // Replace with your endpoint URL
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.role) {
      try {
        const response = await axios.post('https://api.example.com/users', newUser); // Replace with your endpoint URL
        setUsers([...users, response.data]);
        setNewUser({ name: '', email: '', role: '' });
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
    try {
      await axios.delete(`https://api.example.com/users/${id}`); // Replace with your endpoint URL
      setUsers(users.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setNewUser({ name: user.name, email: user.email, role: user.role });
    setShowInputFields(true);
  };

  const handleSaveEdit = async () => {
    if (editUser) {
      try {
        const response = await axios.put(`https://api.example.com/users/${editUser.id}`, newUser); // Replace with your endpoint URL
        setUsers(
          users.map((user) =>
            user.id === editUser.id ? response.data : user
          )
        );
        setEditUser(null);
        setNewUser({ name: '', email: '', role: '' });
        setShowInputFields(false);
        toast.success('User updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Error updating user');
      }
    }
  };

  const handleClickAway = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowInputFields(false);
      setEditUser(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=''>
      <h1 className='text-2xl font-bold mb-5 text-center'>Users</h1>
      <div className='flex items-center justify-end pb-2'>
        <FiSearch className='mr-2' />
        <input
          type='text'
          placeholder='Search by User Name'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border p-2 rounded w-64'
        />
      </div>
      <div className='mb-5' ref={inputRef}>
        {showInputFields ? (
          <>
            <input
              type='text'
              placeholder='User Name'
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className='border p-2 rounded mr-2'
            />
            <input
              type='email'
              placeholder='Email'
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className='border p-2 rounded mr-2'
            />
            <input
              type='text'
              placeholder='Role'
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className='border p-2 rounded mr-2'
            />
            {editUser ? (
              <button
                onClick={handleSaveEdit}
                className='bg-blue-500 text-white p-2 rounded flex items-center'
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleAddUser}
                className='bg-blue-500 text-white p-2 rounded flex items-center'
              >
                Save User
              </button>
            )}
          </>
        ) : (
          <button
            onClick={() => setShowInputFields(true)}
            className='bg-blue-500 text-white p-2 rounded flex items-center'
          >
            <FiPlus className='mr-2' /> Add User
          </button>
        )}
      </div>
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='bg-gray-400'>
            <th className='py-2 px-4 border-b'>Name</th>
            <th className='py-2 px-4 border-b'>Email</th>
            <th className='py-2 px-4 border-b'>Role</th>
            <th className='py-2 px-4 border-b'>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className='text-center'>
              <td className='py-2 px-4 border-b'>{user.name}</td>
              <td className='py-2 px-4 border-b'>{user.email}</td>
              <td className='py-2 px-4 border-b'>{user.role}</td>
              <td className='py-2 px-4 border-b'>
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
    </div>
  );
};

export default Users;