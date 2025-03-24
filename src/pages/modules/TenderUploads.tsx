import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../../components/button/Button';

const API_URL = 'http://197.248.122.31:3000/api/tender/add-tender';

const TenderUploads: React.FC = () => {
  const [formData, setFormData] = useState({
    beneficiary: '',
    tenderNumber: '',
    date: '',
    guaranteeNo: '',
    guarantor: '',
    applicant: '',
    tenderAmount: '',
    expiryDate: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      file: selectedFile,
    });
  };
//   console.log(formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      const data = new FormData();
      data.append('beneficiary', formData.beneficiary);
      data.append('tender_number', formData.tenderNumber);
      data.append('date', formData.date);
      data.append('guarantee_no', formData.guaranteeNo);
      data.append('guarantor', formData.guarantor);
      data.append('applicant', formData.applicant);
      data.append('tender_amount', formData.tenderAmount);
      data.append('expiry_date', formData.expiryDate);
      if (formData.file) {
        data.append('document', formData.file);
      }

      await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Tender document uploaded successfully');
      // Reset form fields
      setFormData({
        beneficiary: '',
        tenderNumber: '',
        date: '',
        guaranteeNo: '',
        guarantor: '',
        applicant: '',
        tenderAmount: '',
        expiryDate: '',
        file: null,
      });
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
    <div className='min-h-screenp-5'>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-2xl font-bold mx-auto text-center'>Upload Tender Document</h1>
      </div>
      <form onSubmit={handleSubmit} autoComplete='off' className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-400 rounded p-5 w-full max-w-4xl mx-auto'>
        <div>
          <p>Beneficiary</p>
          <input
            type='text'
            name='beneficiary'
            placeholder='Enter beneficiary'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.beneficiary}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Tender Number</p>
          <input
            type='text'
            name='tenderNumber'
            placeholder='Enter tender number'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.tenderNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Date</p>
          <input
            type='date'
            name='date'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Guarantee No</p>
          <input
            type='text'
            name='guaranteeNo'
            placeholder='Enter guarantee number'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.guaranteeNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Guarantor</p>
          <input
            type='text'
            name='guarantor'
            placeholder='Enter guarantor'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.guarantor}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Applicant</p>
          <input
            type='text'
            name='applicant'
            placeholder='Enter applicant'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.applicant}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Tender Amount</p>
          <input
            type='number'
            name='tenderAmount'
            placeholder='Enter tender amount'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.tenderAmount}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Expiry Date</p>
          <input
            type='date'
            name='expiryDate'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.expiryDate}
            onChange={handleChange}
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

export default TenderUploads;