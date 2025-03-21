import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../../components/button/Button';

const API_URL = 'http://197.248.122.31:3000/api/tender/add-tender';

const TenderDetailsPage: React.FC = () => {
  const [beneficiary, setBeneficiary] = useState('');
  const [tenderNumber, setTenderNumber] = useState('');
  const [date, setDate] = useState('');
  const [guaranteeNo, setGuaranteeNo] = useState('');
  const [guarantor, setGuarantor] = useState('');
  const [applicant, setApplicant] = useState('');
  const [tenderAmount, setTenderAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('beneficiary', beneficiary);
      formData.append('tender_number', tenderNumber);
      formData.append('date', date);
      formData.append('guarantee_no', guaranteeNo);
      formData.append('guarantor', guarantor);
      formData.append('applicant', applicant);
      formData.append('tender_amount', tenderAmount);
      formData.append('expiry_date', expiryDate);
      if (file) {
        formData.append('document', file);
      }

      await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Tender document uploaded successfully');
      // Reset form fields
      setBeneficiary('');
      setTenderNumber('');
      setDate('');
      setGuaranteeNo('');
      setGuarantor('');
      setApplicant('');
      setTenderAmount('');
      setExpiryDate('');
      setFile(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error processing request');
      } else {
        toast.error('Error processing request');
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-800 min-h-screen h-full p-5'>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-2xl font-bold text-white'>Upload Tender Document</h1>
      </div>
      <form onSubmit={handleSubmit} autoComplete='off' className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded p-5 w-full max-w-4xl mx-auto'>
        <div>
          <p>Beneficiary</p>
          <input
            type='text'
            name='beneficiary'
            placeholder='Enter beneficiary'
            className='border w-full p-2 rounded focus:border-red-500'
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />
        </div>
        <div>
          <p>Tender Number</p>
          <input
            type='text'
            name='tender_number'
            placeholder='Enter tender number'
            className='border w-full p-2 rounded focus:border-red-500'
            value={tenderNumber}
            onChange={(e) => setTenderNumber(e.target.value)}
          />
        </div>
        <div>
          <p>Date</p>
          <input
            type='date'
            name='date'
            className='border w-full p-2 rounded focus:border-red-500'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Guarantee No</p>
          <input
            type='text'
            name='guarantee_no'
            placeholder='Enter guarantee number'
            className='border w-full p-2 rounded focus:border-red-500'
            value={guaranteeNo}
            onChange={(e) => setGuaranteeNo(e.target.value)}
          />
        </div>
        <div>
          <p>Guarantor</p>
          <input
            type='text'
            name='guarantor'
            placeholder='Enter guarantor'
            className='border w-full p-2 rounded focus:border-red-500'
            value={guarantor}
            onChange={(e) => setGuarantor(e.target.value)}
          />
        </div>
        <div>
          <p>Applicant</p>
          <input
            type='text'
            name='applicant'
            placeholder='Enter applicant'
            className='border w-full p-2 rounded focus:border-red-500'
            value={applicant}
            onChange={(e) => setApplicant(e.target.value)}
          />
        </div>
        <div>
          <p>Tender Amount</p>
          <input
            type='number'
            name='tender_amount'
            placeholder='Enter tender amount'
            className='border w-full p-2 rounded focus:border-red-500'
            value={tenderAmount}
            onChange={(e) => setTenderAmount(e.target.value)}
          />
        </div>
        <div>
          <p>Expiry Date</p>
          <input
            type='date'
            name='expiry_date'
            className='border w-full p-2 rounded focus:border-red-500'
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        <div className='col-span-1 md:col-span-2'>
          <p>Document</p>
          <input
            type='file'
            name='document'
            className='border w-full p-2 rounded focus:border-red-500'
            onChange={handleFileChange}
          />
        </div>
        <div className='col-span-1 md:col-span-2 flex justify-end'>
          <Button color='bg-red-500' width='1/2' text='Upload Document' onClick={handleSubmit} isLoading={loading} />
        </div>
      </form>
    </div>
  );
};

export default TenderDetailsPage;