import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiTrash, FiEdit, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

type UserGroup = {
  id: number;
  name: string;
  description: string;
};

const UserGroups: React.FC = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [newUserGroup, setNewUserGroup] = useState({ name: '', description: '' });
  const [showInputFields, setShowInputFields] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUserGroup, setEditUserGroup] = useState<UserGroup | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('https://api.example.com/user-groups'); // Replace with your endpoint URL
        setUserGroups(response.data);
      } catch (error) {
        console.error('Error fetching user groups:', error);
        toast.error('Error fetching user groups');
      }
    };
    fetchUserGroups();
  }, []);

  const handleAddUserGroup = async () => {
    if (newUserGroup.name && newUserGroup.description) {
      try {
        const response = await axios.post('https://api.example.com/user-groups', newUserGroup); // Replace with your endpoint URL
        setUserGroups([...userGroups, response.data]);
        setNewUserGroup({ name: '', description: '' });
        setShowInputFields(false);
        toast.success('User group added successfully');
      } catch (error) {
        console.error('Error adding user group:', error);
        toast.error('Error adding user group');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDeleteUserGroup = async (id: number) => {
    try {
      await axios.delete(`https://api.example.com/user-groups/${id}`); // Replace with your endpoint URL
      setUserGroups(userGroups.filter((userGroup) => userGroup.id !== id));
      toast.success('User group deleted successfully');
    } catch (error) {
      console.error('Error deleting user group:', error);
      toast.error('Error deleting user group');
    }
  };

  const handleEditUserGroup = (userGroup: UserGroup) => {
    setEditUserGroup(userGroup);
    setNewUserGroup({ name: userGroup.name, description: userGroup.description });
    setShowInputFields(true);
  };

  const handleSaveEdit = async () => {
    if (editUserGroup) {
      try {
        const response = await axios.put(`https://api.example.com/user-groups/${editUserGroup.id}`, newUserGroup); // Replace with your endpoint URL
        setUserGroups(
          userGroups.map((userGroup) =>
            userGroup.id === editUserGroup.id ? response.data : userGroup
          )
        );
        setEditUserGroup(null);
        setNewUserGroup({ name: '', description: '' });
        setShowInputFields(false);
        toast.success('User group updated successfully');
      } catch (error) {
        console.error('Error updating user group:', error);
        toast.error('Error updating user group');
      }
    }
  };

  const handleClickAway = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowInputFields(false);
      setEditUserGroup(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, []);

  const filteredUserGroups = userGroups.filter((userGroup) =>
    userGroup.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=''>
      <h1 className='text-2xl font-bold mb-5 text-center'>User Groups</h1>
      <div className='flex items-center justify-end pb-2'>
        <FiSearch className='mr-2' />
        <input
          type='text'
          placeholder='Search by User Group Name'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border p-2 rounded w-64'
        />
      </div>
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='bg-gray-400'>
            <th className='py-2 px-4 border-b'>Name</th>
            <th className='py-2 px-4 border-b'>Description</th>
            <th className='py-2 px-4 border-b'>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserGroups.map((userGroup) => (
            <tr key={userGroup.id} className='text-center'>
              <td className='py-2 px-4 border-b'>{userGroup.name}</td>
              <td className='py-2 px-4 border-b'>{userGroup.description}</td>
              <td className='py-2 px-4 border-b'>
                <div className='flex justify-center space-x-2'>
                  <button
                    onClick={() => handleEditUserGroup(userGroup)}
                    className='text-blue-500 hover:text-blue-700'
                  >
                    <FiEdit size={20} title='Edit' />
                  </button>
                  <button
                    onClick={() => handleDeleteUserGroup(userGroup.id)}
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
      <div className='my-3' ref={inputRef}>
        {showInputFields ? (
          <>
            <input
              type='text'
              placeholder='User Group Name'
              value={newUserGroup.name}
              onChange={(e) => setNewUserGroup({ ...newUserGroup, name: e.target.value })}
              className='border p-2 rounded mr-2'
            />
            <input
              type='text'
              placeholder='Description'
              value={newUserGroup.description}
              onChange={(e) => setNewUserGroup({ ...newUserGroup, description: e.target.value })}
              className='border p-2 rounded mr-2 mb-1'
            />
            {editUserGroup ? (
              <button
                onClick={handleSaveEdit}
                className='bg-blue-500 text-white p-2 rounded flex items-center'
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleAddUserGroup}
                className='bg-blue-500 text-white p-2 rounded flex items-center'
              >
                Save User Group
              </button>
            )}
          </>
        ) : (
          <button
            onClick={() => setShowInputFields(true)}
            className='bg-blue-500 text-white p-2 rounded flex items-center'
          >
            <FiPlus className='mr-2' /> Add User Group
          </button>
        )}
      </div>
    </div>
  );
};

export default UserGroups;