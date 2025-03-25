import React, { useEffect, useState } from 'react';
import { FiDownload, FiTrash, FiSearch } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import axios from 'axios';

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
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://197.248.122.31:3000/api/tender/all-tenders?status=pending'); // Replace with your endpoint URL
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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://197.248.122.31:3000/api/tender/delete-tender/5${id}`); // Replace with your endpoint URL
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const filteredDocuments = documents.filter((document) =>
    document.tender_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-2xl font-bold mx-auto text-center'>Documents</h1>
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
        <table className='min-w-full bg-white'>
          <thead>
            <tr className='bg-gray-400'>
              <th className='py-2 px-4 border-b'>Beneficiary</th>
              <th className='py-2 px-4 border-b'>Tender Number</th>
              <th className='py-2 px-4 border-b'>Date</th>
              <th className='py-2 px-4 border-b'>Guarantee No</th>
              <th className='py-2 px-4 border-b'>Guarantor</th>
              <th className='py-2 px-4 border-b'>Applicant</th>
              <th className='py-2 px-4 border-b'>Tender Amount</th>
              <th className='py-2 px-4 border-b'>Expiry Date</th>
              <th className='py-2 px-4 border-b'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((document) => (
              <tr key={document.id} className='text-center'>
                <td className='py-2 px-4 border-b'>{document.beneficiary}</td>
                <td className='py-2 px-4 border-b'>{document.tender_number}</td>
                <td className='py-2 px-4 border-b'>{new Date(document.date).toLocaleDateString()}</td>
                <td className='py-2 px-4 border-b'>{document.guarantee_no}</td>
                <td className='py-2 px-4 border-b'>{document.guarantor}</td>
                <td className='py-2 px-4 border-b'>{document.applicant}</td>
                <td className='py-2 px-4 border-b'>{formatCurrency(Number(document.tender_amount))}</td>
                <td className='py-2 px-4 border-b'>{new Date(document.expiry_date).toLocaleDateString()}</td>
                <td className='py-2 px-4 border-b space-x-2'>
                  <div className='flex justify-center space-x-2'>
                    <a
                      href={document.document_url}
                      download
                      className='text-blue-500 hover:text-blue-700'
                    >
                      <FiDownload size={20} />
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Documents;