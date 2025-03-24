import React, { useEffect, useState } from 'react';
import { FiSearch, FiCheckCircle, FiFolder, FiXCircle } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import axios from 'axios';

type Document = {
  id: number;
  beneficiary: string;
  tenderNumber: string;
  date: string;
  guaranteeNo: string;
  guarantor: string;
  applicant: string;
  tenderAmount: string;
  expiryDate: string;
  url: string;
  verified: boolean;
};

const VerifyDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.example.com/documents'); // Replace with your endpoint URL
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Error fetching documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const handleVerify = async (id: number) => {
    try {
      // Simulate API call to verify document
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === id ? { ...doc, verified: true } : doc
        )
      );
      toast.success('Document verified successfully');
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Error verifying document');
    }
  };

  const handleRevoke = async (id: number) => {
    try {
      // Simulate API call to revoke document verification
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === id ? { ...doc, verified: false } : doc
        )
      );
      toast.success('Document verification revoked');
    } catch (error) {
      console.error('Error revoking document verification:', error);
      toast.error('Error revoking document verification');
    }
  };

  const filteredDocuments = documents.filter((document) =>
    document.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-2xl font-bold mx-auto text-center'>Verify Tender Documents</h1>
      </div>
      <div className='flex items-center justify-end pb-2'>
        <FiSearch className='mr-2' />
        <input
          type='text'
          placeholder='Search by Tender Number'
          value={searchTerm}
          onChange={handleSearchChange}
          className='border p-2 rounded w-64'
        />
      </div>
      {loading ? (
        <Skeleton count={10} height={40} />
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white'>
            <thead className='sticky top-0 bg-gray-400'>
              <tr>
                <th className='py-2 px-4 border-b'>Beneficiary</th>
                <th className='py-2 px-4 border-b'>Tender Number</th>
                <th className='py-2 px-4 border-b'>Upload Date</th>
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
              {filteredDocuments.map((document) => (
                <tr key={document.id} className='text-center'>
                  <td className='py-2 px-4 border-b'>{document.beneficiary}</td>
                  <td className='py-2 px-4 border-b'>{document.tenderNumber}</td>
                  <td className='py-2 px-4 border-b'>{formatDate(document.date)}</td>
                  <td className='py-2 px-4 border-b'>{document.guaranteeNo}</td>
                  <td className='py-2 px-4 border-b'>{document.guarantor}</td>
                  <td className='py-2 px-4 border-b'>{document.applicant}</td>
                  <td className='py-2 px-4 border-b'>{formatCurrency(Number(document.tenderAmount))}</td>
                  <td className='py-2 px-4 border-b'>{formatDate(document.expiryDate)}</td>
                  <td className='py-2 px-4 border-b'>
                    {document.verified ? (
                      <span className='text-green-500'>Verified</span>
                    ) : (
                      <span className='text-red-500'>Not Verified</span>
                    )}
                  </td>
                  <td className='py-2 px-4 border-b'>
                    <div className='flex space-x-2'>
                      <a
                        href={document.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <FiFolder size={20} title='Preview' />
                      </a>
                      {!document.verified ? (
                        <button
                          onClick={() => handleVerify(document.id)}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          <FiCheckCircle size={20} title='Verify' />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRevoke(document.id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <FiXCircle size={20} title='Revoke Verification' />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const formatDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

export default VerifyDocuments;