import React, { useEffect, useState, useRef } from 'react';
import { FiTrash, FiEdit, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import formatCurrency from '../../utils/FormatCurrency';

// Define the Institution interface
interface Institution {
  id: number;
  institution_name: string;
  type: string;
  balance: number;
  rates: string;
  created_at: string; // or Date if you prefer
}

const Institutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInstitution, setNewInstitution] = useState<Institution>({ 
    id: 0, // Temporary ID for new institutions
    institution_name: '', 
    type: '', 
    rates: '', 
    balance: 0, 
    created_at: '' 
  });
  const [editInstitution, setEditInstitution] = useState<Institution | null>(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://197.248.122.31:3000/api/all-institutions/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstitutions(response.data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Error fetching institutions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitution = async () => {
    const token = localStorage.getItem('token');
    if (newInstitution.institution_name && newInstitution.type) {
      try {
        const response = await axios.post(
          'http://197.248.122.31:3000/api/add-institution/',
          newInstitution,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInstitutions([...institutions, { ...newInstitution, id: response.data.id }]);
        setNewInstitution({ institution_name: '', type: '', rates: '', balance: 0, created_at: '' });
        setShowInputFields(false);
        toast.success('Institution added successfully');
        fetchInstitutions(); // Refresh the list after adding
      } catch (error) {
        console.error('Error adding institution:', error);
        toast.error('Error adding institution: ');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleEditInstitution = (institution: Institution) => {
    setEditInstitution(institution);
    setNewInstitution({ 
      institution_name: institution.institution_name, 
      type: institution.type, 
      rates: institution.rates, 
      balance: institution.balance, 
      created_at: institution.created_at 
    });
    setShowInputFields(true);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');
    if (editInstitution) {
      try {
        await axios.put(
          `http://197.248.122.31:3000/api/edit-institution/${editInstitution.id}`,
          { 
            institution_name: newInstitution.institution_name, 
            type: newInstitution.type, 
            rates: newInstitution.rates 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInstitutions(
          institutions.map((inst) =>
            inst.id === editInstitution.id ? { ...inst, ...newInstitution } : inst
          )
        );
        setEditInstitution(null);
        setNewInstitution({ institution_name: '', type: '', rates: '', balance: 0, created_at: '' });
        setShowInputFields(false);
        toast.success('Institution updated successfully');
        fetchInstitutions(); // Refresh the list after editing
      } catch (error) {
        console.error('Error updating institution:', error);
        toast.error('Error updating institution: ' + error.message);
      }
    }
  };

  const handleDeleteInstitution = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://197.248.122.31:3000/api/delete-institution/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInstitutions(institutions.filter((institution) => institution.id !== id));
      toast.success('Institution deleted successfully');
      fetchInstitutions(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting Institution:', error);
      toast.error('Error deleting Institution: ' + error.message);
    }
  };

  const filteredInstitutions = institutions.filter((institution) =>
    institution.institution_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='flex items-center justify-between py-6'>
        <h1 className='text-2xl mb-5 font-bold'>Institutions</h1>
        <div className='flex items-center justify-center w-full'>
          <input
            type='text'
            placeholder='Search by Institution Name'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border p-2 rounded w-64'
          />
        </div>
      </div>
      <div className='py-2'>
        <button
          onClick={() => {
            setShowInputFields(true);
            setNewInstitution({ institution_name: '', type: '', rates: '', balance: 0, created_at: '' });
            setEditInstitution(null);
          }}
          className='bg-blue-500 text-black px-4 p-1 rounded-full flex items-center'
        >
          <FiPlus className='mr-2 ' /> Add Institution
        </button>
      </div>
      {loading ? (
        <Skeleton count={10} height={40} />
      ) : (
        <table className='min-w-full bg-white text-left'>
          <thead>
            <tr className='bg-gray-400 text-center'>
              <th className='py-2 px-4 border-b'>Institution Name</th>
              <th className='py-2 px-4 border-b'>Type</th>
              <th className='py-2 px-4 border-b'>Balance</th>
              <th className='py-2 px-4 border-b'>Rate</th>
              <th className='py-2 px-4 border-b'>Date Created</th>
              <th className='py-2 px-4 border-b'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstitutions.map((institution, index) => (
              <tr key={institution.id} className={`text-center ${index % 2 === 0 ? 'bg-gray-200' : ''}`}>
                <td className='py-2 px-4'>{institution.institution_name}</td>
                <td className='py-2 px-4'>{institution.type}</td>
                <td className='py-2 px-4'>{formatCurrency(Number(institution.balance))}</td>
                <td className='py-2 px-4'>{institution.rates}</td>
                <td className='py-2 px-4'>{new Date(institution.created_at).toLocaleDateString()}</td>
                <td className='py-2 px-4'>
                  <button
                    onClick={() => handleEditInstitution(institution)}
                    className='text-blue-500 px-1 hover:text-blue-700'
                  >
                    <FiEdit size={20} title='Edit' />
                  </button>
                  <button
                    onClick={() => handleDeleteInstitution(institution.id)}
                    className='text-red-500 px-1 hover:text-red-700'
                  >
                    <FiTrash size={20} title='Delete' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showInputFields && (
        <div className='my-3' ref={inputRef}>
          <input
            type='text'
            placeholder='Institution Name'
            value={newInstitution.institution_name}
            onChange={(e) => setNewInstitution({ ...newInstitution, institution_name: e.target.value })}
            className='border p-2 rounded m-1'
          />
          <input
            type='text'
            placeholder='Type'
            value={newInstitution.type}
            onChange={(e) => setNewInstitution({ ...newInstitution, type: e.target.value })}
            className='border p-2 rounded m-1'
          />
          <input
            type='text'
            placeholder='Rates'
            value={newInstitution.rates}
            onChange={(e) => setNewInstitution({ ...newInstitution, rates: e.target.value })}
            className='border p-2 rounded m-1'
          />
          {editInstitution ? (
            <button onClick={handleSaveEdit} className='bg-blue-500 text-black p-2 rounded'>
              Save Changes
            </button>
          ) : (
            <button onClick={handleAddInstitution} className='bg-blue-500 text-black p-2 rounded'>
              Save Institution
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Institutions;