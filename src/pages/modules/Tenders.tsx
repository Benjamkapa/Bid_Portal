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
import { GoSearch } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';



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
        <h1 className='text-2xl font-bold'>Documents List</h1>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search by tender number'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border p-2 rounded w-64 '
          />
          <GoSearch size={23} className='absolute top-2 right-2 '/>
        </div>
        <div className='space-x-3'>
          {['All', 'Pending', 'Approved',"Rejected"].map((status) => (
            <button
              key={status}
              className={`rounded-full px-4 py-1 cursor-pointer ${
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
        <table className='min-w-full bg-white text-sm '>
          <thead>
          <tr className="bg-[rgb(92,72,155,0.9)]">
              <th className='py-4 px-4'>Beneficiary</th>
              <th className='py-4 px-4'>Tender No</th>
              <th className='py-4 px-4'>Date</th>
              <th className='py-4 px-4'>Guarantee No</th>
              <th className='py-4 px-4'>Guarantor</th>
              <th className='py-4 px-4'>Applicant</th>
              <th className='py-4 px-4'>Tender Amount</th>
              <th className='py-4 px-4'>Expiry</th>
              <th className='py-4 px-4'>Status</th>
              <th className='py-4 px-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((document, index) =>{

              let bgColor;
              let textColor;
              switch (document?.status) {
                case "pending":
                  bgColor = "bg-yellow-500"
                  textColor = "text-yellow-500 "     
                  break;
                  case "approved":
                    bgColor = "bg-green-500"
                     textColor = "text-green-500"  
                    break;
                  case "rejected":
                    bgColor = "bg-red-500"
                    textColor = "text-red-500" 

                    break
                default:
                  break;
              }
            
              return            (
                <tr key={document.id} className={`text-center  ${index % 2 !== 0 ? 'bg-[rgb(92,72,155,0.3)]' : ''}`}>
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
                     authState?.user?.role ==="user" ? <span className={`${textColor}`}>{document.status}</span> :
                    <select
                      value={document.status}
                      onChange={(e) => handleStatusChange(document, e.target.value)}
                      className={`p-1 rounded  text-gray-800 ${bgColor}`}
                     >
                      <option value='pending'>Pending</option>
                      <option value='approved'>Approved</option>
                      <option value='rejected'>Rejected</option>
                  </select>
                   }
                    </td>
                  <td className='py-1.5 px-4 space-x-2'>
                    <div className='flex justify-center items-center space-x-2'>
                      { authState?.user?.role !=="admin" && 
                      <Link to={`/uploads/${document.tender_number}`}>
                      <FaRegEdit  size={15} title='Edit tender'/>                 
                      </Link>
                       }
                       {
                          authState?.user?.role !=="admin" && <button
                          onClick={() => handleDelete(document.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <FiTrash size={15} title='Delete tender' />
                        </button>
                        }
    
                      <a target='blank' href={document.document_url}>
                 <FaFilePdf size={20} className='text-gray-700' title='View  tender'/>
                      </a>
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
