import React, { useState, useEffect } from 'react';
// import { FiSearch } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import formatCurrency from '../../utils/FormatCurrency';
import { GoSearch } from 'react-icons/go'; 

type Transaction = {
  id: number;
  institution_id: number;
  amount: string;
  description: string;
  created_at: string;
  institution_name: string;
};

const Transaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://197.248.122.31:3000/api/transactions/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Access the "transactions" array from the response data
        if (Array.isArray(response.data.transactions)) {
          setTransactions(response.data.transactions);
          console.log('Fetched Transactions:', response.data.transactions);
        } else {
          console.warn('Expected an array but received:', response.data);
          setTransactions([]);
        }

      } catch (error) {
        console.error('Error fetching Transactions:', error);
        toast.error('Error fetching Transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className='flex justify-between items-center py-6'>
       <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="pb-2 justify-center rounded w-full flex">
          <input
           type="text"
           placeholder="Search by Description"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="border p-2 items-center rounded w-64"
         />
         <GoSearch size={23} className='relative top-2 right-8 '/>
        </div>
      </div>

      {loading ? (
        <Skeleton count={6} height={40} />
      ) : (
        <table className="min-w-full bg-white">
          <thead>
          <tr className="bg-[rgb(92,72,155,0.9)] text-white text-center">
              <th className="py-2 px-4">Institution</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-2 px-4 text-center">No transactions found</td>
              </tr>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <tr
                  key={transaction.institution_id}
                  className={`text-center ${index % 2 !== 0 ? 'bg-[rgb(92,72,155,0.3)]' : ''}`}
                >
                  <td className="py-2 px-4">{transaction.institution_name}</td>
                  <td className="py-2 px-4">{formatCurrency(Number(transaction.amount))}</td>
                  <td className="py-2 px-4">{transaction.description}</td>
                  <td className="py-2 px-4">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transaction;
