import { useEffect, useState, useRef } from 'react';
import { FiTrash, FiEdit, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import formatCurrency from '../../utils/FormatCurrency';
import { GoSearch } from 'react-icons/go';

interface Institution {
  id: number;
  institution_name: string;
  type: string | null;
  balance: number;
  rates: string;
  created_at: string;
  organization_type: string;
}

const Institutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInstitution, setNewInstitution] = useState<Institution>({
    id: 0,
    institution_name: '',
    type: null,
    rates: '',
    balance: 0,
    created_at: '',
    organization_type: '',
  });
  const [editInstitution, setEditInstitution] = useState<Institution | null>(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]); // State for the dependent type options

  useEffect(() => {
    fetchInstitutions();
    fetchOrganizationTypes(); // Fetch organization types when component mounts
  }, []);

  // Fetch all institutions
  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://197.248.122.31:3000/api/all-institutions/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        const institutions = response.data as Institution[];
        setInstitutions(institutions);

        const types = [
          ...new Set(
            institutions
              .map((institution: Institution) => institution.organization_type)
              .filter((type: string | null) => type !== null && type !== undefined)
          ),
        ];

        setOrganizationTypes(types);
      } else {
        console.error('Invalid data format');
        toast.error('Error fetching institutions');
      }
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Error fetching institutions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch organization types from the API
  const fetchOrganizationTypes = async () => {
    try {
      const response = await axios.get('http://197.248.122.31:3000/api/organization_types');
      if (response.data.status === 1000) {
        setOrganizationTypes(response.data.data);
      } else {
        console.error('Error fetching organization types');
        toast.error('Error fetching organization types');
      }
    } catch (error) {
      console.error('Error fetching organization types:', error);
      toast.error('Error fetching organization types');
    }
  };
  // Fetch the type options based on the selected organization type
  const fetchTypeOptions = async (organizationType: string) => {
    if (!organizationType) return;
    
    try {
      const response = await axios.get(
        `http://197.248.122.31:3000/api/detail-types?value=${organizationType}`
      );

      if (response.data.status === 1000) {
        setTypeOptions(response.data.data); // Set the type options based on the response
      } else {
        toast.error('Error fetching type options');
      }
    } catch (error) {
      console.error('Error fetching type options:', error);
      toast.error('Error fetching type options');
    }
  };

  // Trigger the API call when organization_type changes
  useEffect(() => {
    if (newInstitution.organization_type) {
      fetchTypeOptions(newInstitution.organization_type);
    }
  }, [newInstitution.organization_type]); // Dependency on organization_type

  const handleAddInstitution = async () => {
    const token = localStorage.getItem('token');
    if (newInstitution.institution_name && newInstitution.organization_type && newInstitution.type) {
      try {
        const response = await axios.post(
          'http://197.248.122.31:3000/api/add-institution/',
          newInstitution,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInstitutions([...institutions, { ...newInstitution, id: response.data.id }]);
        setShowInputFields(false);
        toast.success('Institution added successfully');
        fetchInstitutions();
      } catch (error) {
        console.error('Error adding institution:', error);
        toast.error('Error adding institution');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleEditInstitution = (institution: Institution) => {
    setEditInstitution(institution);
    setNewInstitution(institution);
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
            organization_type: newInstitution.organization_type,
            rates: newInstitution.rates,
            type: newInstitution.type,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInstitutions(
          institutions.map((inst) =>
            inst.id === editInstitution.id ? { ...inst, ...newInstitution } : inst
          )
        );
        setEditInstitution(null);
        setShowInputFields(false);
        toast.success('Institution updated successfully');
        fetchInstitutions();
      } catch (error) {
        console.error('Error updating institution:', error);
        toast.error('Error updating institution');
      }
    }
  };

  const handleDeleteInstitution = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://197.248.122.31:3000/api/delete-institution/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstitutions(institutions.filter((institution) => institution.id !== id));
      toast.success('Institution deleted successfully');
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast.error('Error deleting institution');
    }
  };

  const filteredInstitutions = institutions.filter((institution) =>
    institution.institution_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search and Add Institution Button */}
      <div className="flex items-center justify-between py-6">
        <h1 className="text-2xl mb-5 font-bold">Institutions</h1>
        <div className="flex items-center justify-center w-full">
          <input
            type="text"
            placeholder="Search by Institution Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <GoSearch size={23} className="relative top-.5 right-8" />
        </div>
      </div>
      <div className="py-2">
        <button
          onClick={() => {
            setShowInputFields(true);
            setEditInstitution(null);
          }}
          className="bg-blue-500 text-black px-4 p-1 rounded-full flex items-center"
        >
          <FiPlus className="mr-2 " /> Add Institution
        </button>
      </div>

      {/* Table to Display Institutions */}
      {loading ? (
        <Skeleton count={10} height={40} />
      ) : institutions.length > 0 ? (
        <table className="min-w-full bg-white text-left">
          <thead>
            <tr className="bg-[rgb(92,72,155,0.9)] text-center">
              <th className="py-2 px-4">Institution Name</th>
              <th className="py-2 px-4">Organization Category</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Balance</th>
              <th className="py-2 px-4">Rate</th>
              <th className="py-2 px-4">Date Created</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstitutions.map((institution, index) => (
              <tr
                key={institution.id}
                className={`text-center ${index % 2 !== 0 ? 'bg-[rgb(92,72,155,0.3)]' : ''}`}
              >
                <td className="py-2 px-4">{institution.institution_name}</td>
                <td className="py-2 px-4">{institution.organization_type}</td>
                <td className="py-2 px-4">{institution.type}</td>
                <td className="py-2 px-4">{formatCurrency(Number(institution.balance))}</td>
                <td className="py-2 px-4">{institution.rates}</td>
                <td className="py-2 px-4">
                  {new Date(institution.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEditInstitution(institution)}
                    className="text-blue-500 px-1 hover:text-blue-700"
                  >
                    <FiEdit size={20} title="Edit" />
                  </button>
                  <button
                    onClick={() => handleDeleteInstitution(institution.id)}
                    className="text-red-500 px-1 hover:text-red-700"
                  >
                    <FiTrash size={20} title="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No institutions available</div>
      )}

      {/* Input Fields for Adding/Editing Institution */}
      {showInputFields && (
        <div className="my-3" ref={inputRef}>
          <input
            type="text"
            placeholder="Institution Name"
            value={newInstitution.institution_name}
            onChange={(e) => setNewInstitution({ ...newInstitution, institution_name: e.target.value })}
            className="border p-2 rounded m-1"
          />
          <input
            type="text"
            placeholder="Rates"
            value={newInstitution.rates}
            onChange={(e) => setNewInstitution({ ...newInstitution, rates: e.target.value })}
            className="border p-2 rounded m-1"
          />
          <select
            value={newInstitution.organization_type || ''}
            onChange={(e) => setNewInstitution({ ...newInstitution, organization_type: e.target.value })}
            className="border p-2 rounded m-1"
          >
            <option value="" disabled>Select Organization Category</option>
            {organizationTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={newInstitution.type || ''}
            onChange={(e) => setNewInstitution({ ...newInstitution, type: e.target.value })}
            className="border p-2 rounded m-1"
          >
            <option value="" disabled>Select Type</option>
            {typeOptions.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {editInstitution ? (
            <button onClick={handleSaveEdit} className="bg-purple-500 text-black p-2 rounded">
              Save Changes
            </button>
          ) : (
            <button onClick={handleAddInstitution} className="bg-blue-500 text-black p-2 rounded">
              Save Institution
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Institutions;


