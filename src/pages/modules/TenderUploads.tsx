import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../../components/button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getUserProfile } from '../../redux/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
const API_URL = 'http://197.248.122.31:3000/api/tender';
// const EDIT_URL = 'http://197.248.122.31:3000/api/tender/edit-tender/4';


const TenderUploads: React.FC = () => {
const {tenderNo}=useParams()
const navigate=useNavigate()
// console.log("tenderNo is",tenderNo)

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
  const [isEditing, setIsEditing] = useState(false)
  const [tenderId, setTenderId] = useState("")

    // get user profile
    const dispatch = useDispatch<AppDispatch>();
    const authState = useSelector((state: RootState) => state.auth);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
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
        // console.log("tender is",tender)
        setFormData({
          beneficiary: tender.beneficiary || '',
          tenderNumber: tender.tender_number || '',
          date: tender.date || '',
          guaranteeNo: tender.guarantee_no || '',
          guarantor: tender.guarantor || '',
          applicant: tender.applicant || '',
          tenderAmount: tender.tender_amount || '',
          expiryDate: tender.expiry_date || '',
          file: null,
        });
        setTenderId(tender.id)
        setIsEditing(true)
      } catch (error) {
        toast.error('Failed to load tender details');
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
  
    // console.log("Editing",isEditing)

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

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
      if (authState?.user?.id) {
        data.append('user_id', authState.user.id);
      }
      if (formData.file) {
        data.append('document', formData.file);
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

      toast.success('Tender  uploaded successfully');
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
    <div className='min-h-screen'>
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-xl font-bold'>{tenderNo? "Update Docuent Details":"Enter Document Details"}</h1>
      </div>
      <form  autoComplete='off' className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded p-5 w-full max-w-4xl'>
      <div>
          <p>Document type</p>

<select name="document_type" className="p-2 border w-full">
  <option value="">Bid security</option>
  <option value="">Performance security</option>
  <option value="">Performance quarantee</option>
  <option value="">Other</option>

</select>
        </div>
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
          <p>Security No</p>
          <input
            type='text'
            name='guaranteeNo'
            placeholder='Enter security number'
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
            className='border w-full p-2 rounded'
            onChange={handleFileChange}
          />
        </div>
        <div className='col-span-1 md:col-span-2 flex justify-end'>
          <Button color='bg-red-500' width='1/2' text={tenderNo? "Update Tender":"Create tender"}  onClick={handleSubmit} isLoading={loading} />
        </div>
      </form>
    </div>
  );
};

export default TenderUploads;


