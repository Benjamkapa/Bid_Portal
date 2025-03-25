import React, { useEffect, useState } from 'react';
import {  FiTrash } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import formatCurrency from '../../utils/FormatCurrency';
import { getUserProfile, token } from '../../redux/authSlice';

import { FaFilePdf } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';


type Document = {
  id: number;
  beneficiary: string;
  tender_number: string;
  date: string;
  guarantee_no: string;
  guarantor: string;
  applicant: string;
  tender_amount: string;
  expiry_date: string;
  document_url: string;
  status: string; 
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');


  // get user profile
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState?.isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, authState?.isAuthenticated]);
  
  console.log("authStateis",authState.user)

  let url= authState?.user?.role ==="user" ?   `http://197.248.122.31:3000/api/tender/get-tender-based/${authState?.user?.instituion?.institution_id}`: "http://197.248.122.31:3000/api/tender/all-tenders"


  
  useEffect(() => {
    fetchDocuments();
  }, []);

  // get all Tenders
  const fetchDocuments = async () => {
    setLoading(true);
    try {
     
      const response=await axios.get(url)
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast.error('Error fetching tenders');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle tender delete
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://197.248.122.31:3000/api/tender/delete-tender/${id}`);
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
      toast.success('Tender deleted successfully');
    } catch (error) {
      console.error('Error deleting tender:', error);
      toast.error('Error deleting tender');
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    return (
      (statusFilter === 'All' || doc.status.toLowerCase() === statusFilter.toLowerCase()) &&
      doc.tender_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  //update tender status
  const handleStatusChange = async (doc: any, status: string) => {
    try {

    const body=JSON.stringify({
        status:status,
        user_id: doc?.user_id
    })
 await axios.post(`http://197.248.122.31:3000/api/tender/single-tender/${doc?.id}/status`,body ,token());

      fetchDocuments();
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };
  

  return (
    <div>
      <div className="flex justify-between items-center pb-10">
        <h1 className='text-2xl'>Tenders List</h1>
        <div className='flex items-center'>
          <input
            type='text'
            placeholder='Search by Tender Number'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border p-2 rounded w-64'
          />
        </div>
        <div className='space-x-3'>
          {['All', 'Pending', 'Approved'].map((status) => (
            <button
              key={status}
              className={`rounded-full px-4 py-1 ${
                statusFilter === status ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton count={10} height={40} />
      ) : (
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>Beneficiary</th>
              <th className='py-2 px-4 border-b'>Tender Number</th>
              <th className='py-2 px-4 border-b'>Date</th>
              <th className='py-2 px-4 border-b'>Guarantee No</th>
              <th className='py-2 px-4 border-b'>Guarantor</th>
              <th className='py-2 px-4 border-b'>Applicant</th>
              <th className='py-2 px-4 border-b'>Tender Amount</th>
              <th className='py-2 px-4 border-b'>Expiry Date</th>
              <th className='py-2 px-4 border-b'>Status</th>
              <th className='py-2 px-4 border-b'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((document, index) =>{

              let color;
              switch (document.status) {
                case "pending":
                  color="yellow-500"                
                  break;
                  case "approved":
                    color="green-500"
                    break;
                  case "rejected":
                    color="red-500"
                    break
                default:
                  break;
              }
              return            (
                <tr key={document.id} className={`text-center ${index % 2 === 0 ? 'bg-gray-200' : ''}`}>
                  <td className='py-1.5 px-4'>{document.beneficiary}</td>
                  <td className='py-1.5 px-4'>{document.tender_number}</td>
                  <td className='py-1.5 px-4'>{new Date(document.date).toLocaleDateString()}</td>
                  <td className='py-1.5 px-4'>{document.guarantee_no}</td>
                  <td className='py-1.5 px-4'>{document.guarantor}</td>
                  <td className='py-1.5 px-4'>{document.applicant}</td>
                  <td className='py-1.5 px-4'>{formatCurrency(Number(document.tender_amount))}</td>
                  <td className='py-1.5 px-4'>{new Date(document.expiry_date).toLocaleDateString()}</td>
                  <td className='py-1 px-4'>

                  {
  authState?.user?.role ==="user" ? <span className={`text-${color}`}>{document.status}</span> :                       <select
  value={document.status}
  onChange={(e) => handleStatusChange(document, e.target.value)}
  className={` p-1 rounded bg-${color} text-gray-800 `}
>
  <option value='pending'>Pending</option>
  <option value='approved'>Approved</option>
  <option value='rejected'>Rejected</option>
</select>
}

                    </td>
                  <td className='py-1.5 px-4 space-x-2'>
                    <div className='flex justify-center space-x-2'>
                      {/* <a  href={document.document_url} download className='text-blue-500 hover:text-blue-700'>
                        <FiDownload size={20} />
                      </a> */}
                      <a target='blank' href={document.document_url}>

                 <FaFilePdf size={25}/>

                      </a>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <FiTrash size={20} title='Delete' />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            }
            

            
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Documents;
