import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiTrash, FiEdit, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

type Institution = {
  id: number;
  name: string;
  type: string;
};

const Institution: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [newInstitution, setNewInstitution] = useState({ name: '', type: '' });
  const [showInputFields, setShowInputFields] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editInstitution, setEditInstitution] = useState<Institution | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      const token = 'YOUR_TOKEN_HERE'; // Replace with your actual token
      try {
        const response = await axios.get('http://197.248.122.31:3000/api/all-institutions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInstitutions(response.data);
      } catch (error) {
        console.error('Error fetching institutions:', error);
        toast.error('Error fetching institutions');
      }
    };
    fetchInstitutions();
  }, []);

  const handleAddInstitution = async () => {
    const token = 'YOUR_TOKEN_HERE'; // Replace with your actual token
    if (newInstitution.name && newInstitution.type) {
      try {
        const response = await axios.post('http://197.248.122.31:3000/api/all-institutions', newInstitution, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInstitutions([...institutions, response.data]);
        setNewInstitution({ name: '', type: '' });
        setShowInputFields(false);
        toast.success('Institution added successfully');
      } catch (error) {
        console.error('Error adding institution:', error);
        toast.error('Error adding institution');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDeleteInstitution = async (id: number) => {
    const token = 'YOUR_TOKEN_HERE'; // Replace with your actual token
    try {
      await axios.delete(`http://197.248.122.31:3000/api/all-institutions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInstitutions(institutions.filter((institution) => institution.id !== id));
      toast.success('Institution deleted successfully');
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast.error('Error deleting institution');
    }
  };

  const handleEditInstitution = (institution: Institution) => {
    setEditInstitution(institution);
    setNewInstitution({ name: institution.name, type: institution.type });
    setShowInputFields(true);
  };

  const handleSaveEdit = async () => {
    const token = 'YOUR_TOKEN_HERE'; // Replace with your actual token
    if (editInstitution) {
      try {
        const response = await axios.put(`http://197.248.122.31:3000/api/all-institutions/${editInstitution.id}`, newInstitution, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInstitutions(
          institutions.map((institution) =>
            institution.id === editInstitution.id ? response.data : institution
          )
        );
        setEditInstitution(null);
        setNewInstitution({ name: '', type: '' });
        setShowInputFields(false);
        toast.success('Institution updated successfully');
      } catch (error) {
        console.error('Error updating institution:', error);
        toast.error('Error updating institution');
      }
    }
  };

  const handleClickAway = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowInputFields(false);
      setEditInstitution(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, []);

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=''>
      <h1 className='text-2xl font-bold mb-5 text-center'>Institutions</h1>
      <div className='mb-5' ref={inputRef}>
        {showInputFields ? (
          <>
            <input
              type='text'
              placeholder='Institution Name'
              value={newInstitution.name}
              onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
              className='border p-2 rounded mr-2'
            />
            <input
              type='text'
              placeholder='Institution Type'
              value={newInstitution.type}
              onChange={(e) => setNewInstitution({ ...newInstitution, type: e.target.value })}
              className='border p-2 rounded mr-2 mb-2'
            />
            {editInstitution ? (
              <button
                onClick={handleSaveEdit}
                className='bg-blue-500 text-white p-2 rounded flex items-center'
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleAddInstitution}
                className='bg-blue-500 text-white p-2 rounded flex items-center'
              >
                Save Institution
              </button>
            )}
          </>
        ) : (
          <button
            onClick={() => setShowInputFields(true)}
            className='bg-blue-500 text-white p-2 rounded flex items-center'
          >
            <FiPlus className='mr-2' /> Add Institution
          </button>
        )}
      </div>
      <div className='flex items-center justify-end pb-2'>
        <FiSearch className='mr-2' />
        <input
          type='text'
          placeholder='Search by Institution Name'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border p-2 rounded w-64'
        />
      </div>
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='bg-gray-400'>
            <th className='py-2 px-4 border-b'>Name</th>
            <th className='py-2 px-4 border-b'>Type</th>
            <th className='py-2 px-4 border-b'>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstitutions.map((institution) => (
            <tr key={institution.id} className='text-center'>
              <td className='py-2 px-4 border-b'>{institution.name}</td>
              <td className='py-2 px-4 border-b'>{institution.type}</td>
              <td className='py-2 px-4 border-b'>
                <div className='flex justify-center space-x-2'>
                  <button
                    onClick={() => handleEditInstitution(institution)}
                    className='text-blue-500 hover:text-blue-700'
                  >
                    <FiEdit size={20} title='Edit' />
                  </button>
                  <button
                    onClick={() => handleDeleteInstitution(institution.id)}
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

export default Institution;