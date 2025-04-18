import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../../components/button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getUserProfile } from '../../redux/authSlice';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://197.248.122.31:3000/api/tender';

const Applications: React.FC = () => {
  const { tenderNo } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    beneficiary: '',
    tenderNumber: '',
    date: '',
    tenderNo: '',
    guarantor: '',
    applicant: '',
    tenderAmount: '',
    expiryDate: '',
    description: '',
    applicantAddress: '',
    duration: '',
  });

  const [kraPinFile, setKraPinFile] = useState<File | null>(null);
  const [cr12File, setCr12File] = useState<File | null>(null);
  const [registrationFile, setRegistrationFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [taxComplianceFile, setTaxComplianceFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tenderId, setTenderId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !authState?.isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, authState?.isAuthenticated]);

  useEffect(() => {
    if (tenderNo) {
      fetchTenderDetails(tenderNo);
    }
  }, [tenderNo]);

  const fetchTenderDetails = async (tenderNo: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/single-tender/${tenderNo}`);
      const tender = response.data;
      setFormData({
        beneficiary: tender.beneficiary || '',
        tenderNumber: tender.tender_number || '',
        date: tender.date || '',
        tenderNo: tender.tender_no || '',
        guarantor: tender.guarantor || '',
        applicant: tender.applicant || '',
        tenderAmount: tender.tender_amount || '',
        expiryDate: tender.expiry_date || '',
        description: tender.description || '',
        applicantAddress: tender.applicant_address || '',
        duration: tender.duration || '',
      });
      setTenderId(tender.id);
      setIsEditing(true);
    } catch (error) {
      toast.error('Failed to load tender details');
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files ? e.target.files[0] : null;
    switch (type) {
      case 'kraPin':
        setKraPinFile(file);
        break;
      case 'cr12':
        setCr12File(file);
        break;
      case 'registration':
        setRegistrationFile(file);
        break;
      case 'profile':
        setProfileFile(file);
        break;
      case 'taxCompliance':
        setTaxComplianceFile(file);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (authState?.user?.id) {
        data.append('user_id', authState.user.id);
      }

      if (kraPinFile) data.append('kraPinDocument', kraPinFile);
      if (cr12File) data.append('cr12Document', cr12File);
      if (registrationFile) data.append('registrationDocument', registrationFile);
      if (profileFile) data.append('profileDocument', profileFile);
      if (taxComplianceFile) data.append('taxComplianceDocument', taxComplianceFile);

      console.log('Form Data Contents:');
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: `${(value.size / 1024).toFixed(2)} KB`
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      if (isEditing) {
        await axios.put(`${API_URL}/edit-tender/${tenderId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
        toast.success('Tender updated successfully');
      } else {
        await axios.post(`${API_URL}/add-tender`, data, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
        toast.success('Tender uploaded successfully');
      }

      navigate('/tenders');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error processing request');
      } else {
        toast.error('Error processing request');
      }
      console.error('Submit Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // const documentTitles = [
  //   'KRA PIN',
  //   'CR12',
  //   'Company Registration Certificate',
  //   'Company Profile',
  //   'Tax Compliance'
  // ];

  return (
    <div>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-xl font-bold'>{tenderNo ? 'Update Bid Security Details' : 'Apply for Bid Security'}</h1>
      </div>

      <form onSubmit={handleSubmit} autoComplete='off' className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded p-5 w-full'>
        <div>
          <p>Security type</p>
          <select name='document_type' className='p-2 border rounded w-full'>
            <option value=''>Bid security</option>
            <option value=''>Performance security</option>
            <option value=''>Performance guarantee</option>
            <option value=''>Other</option>
          </select>
        </div>

        <div>
          <p>Beneficiary Address</p>
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
          <p>Security Amount</p>
          <input
            type='number'
            name='tenderAmount'
            placeholder='Enter security amount'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.tenderAmount}
            onChange={handleChange}
          />
        </div>

        <div>
          <p>Duration (Days)</p>
          <input
            type='number'
            name='duration'
            placeholder='Enter duration in days'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.duration}
            onChange={handleChange}
          />
        </div>

        <div>
          <p>Security No</p>
          <input
            type='text'
            name='tenderNo'
            placeholder='Enter security number'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.tenderNo}
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
          <p>Applicant Address</p>
          <input
            type='text'
            name='applicantAddress'
            placeholder='Enter applicant address'
            className='border w-full p-2 rounded focus:border-red-500'
            value={formData.applicantAddress}
            onChange={handleChange}
          />
        </div>

        {/* Uploads */}
        <div className='gap-4 col-span-1 flex md:col-span-3 flex-wrap'>
          <div className='w-full py-5'>
            <b><i>Required Documents</i></b>
            <i><p className='pb-3 text-gray-600'>Please upload all required company documents in PDF format</p></i>
            <div className='flex flex-wrap gap-4'>
              <div className='w-full sm:w-1/3 lg:w-1/4'>
                <p>KRA PIN</p>
                <input
                  type='file'
                  className='border p-2 rounded w-full'
                  onChange={(e) => handleFileChange(e, 'kraPin')}
                />
              </div>
              <div className='w-full sm:w-1/3 lg:w-1/4'>
                <p>CR12</p>
                <input
                  type='file'
                  className='border p-2 rounded w-full'
                  onChange={(e) => handleFileChange(e, 'cr12')}
                />
              </div>
              <div className='w-full sm:w-1/3 lg:w-1/4'>
                <p>Company Registration Certificate</p>
                <input
                  type='file'
                  className='border p-2 rounded w-full'
                  onChange={(e) => handleFileChange(e, 'registration')}
                />
              </div>
              <div className='w-full sm:w-1/3 lg:w-1/4'>
                <p>Company Profile</p>
                <input
                  type='file'
                  className='border p-2 rounded w-full'
                  onChange={(e) => handleFileChange(e, 'profile')}
                />
              </div>
              <div className='w-full sm:w-1/3 lg:w-1/4'>
                <p>Tax Compliance</p>
                <input
                  type='file'
                  className='border p-2 rounded w-full'
                  onChange={(e) => handleFileChange(e, 'taxCompliance')}
                />
              </div>
            </div>
          </div>

          <div className='w-full grid py-5'>
            <b><i>Description</i></b>
            <textarea
              name='description'
              placeholder='Enter description'
              className='border p-2 rounded focus:border-red-500 h-30 w-1/2 resize'
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='w-1/3 md:col-span-3 justify-end hover: bg-blue-900 rounded-box'>
          <Button
            color='bg-blue-500'
            
            text={tenderNo ? 'Update' : 'Apply'}
            onClick={handleSubmit}
            isLoading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default Applications;