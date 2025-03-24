import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import axios from 'axios';

type Transaction = {
  id: number;
  institution: string;
  amount: number;
  date: string;
  type: string;
};

const Transaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.example.com/transactions'); // Replace with your endpoint URL
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold mb-5 text-center'>Transactions</h1>
      <div className='flex items-center justify-end pb-2'>
        <FiSearch className='mr-2' />
        <input
          type='text'
          placeholder='Search by Institution'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border p-2 rounded w-64'
        />
      </div>
      {loading ? (
        <Skeleton count={6} height={40} />
      ) : (
        <table className='min-w-full bg-white'>
          <thead>
            <tr className='bg-gray-400'>
              <th className='py-2 px-4 border-b'>Institution</th>
              <th className='py-2 px-4 border-b'>Amount</th>
              <th className='py-2 px-4 border-b'>Date</th>
              <th className='py-2 px-4 border-b'>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className='text-center'>
                <td className='py-2 px-4 border-b'>{transaction.institution}</td>
                <td className='py-2 px-4 border-b'>{transaction.amount}</td>
                <td className='py-2 px-4 border-b'>{transaction.date}</td>
                <td className='py-2 px-4 border-b'>{transaction.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transaction;