import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import TableComponent from "../../components/grid/TransactionDetailsTable";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const TransactionDetails = () => {
  const {gameId} = useParams()
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("authToken");
    

      if (!token) {
        toast.error("Authentication token not found!");
        return;
      }

      console.log("Game ID:", gameId);

      // toast.success(`Auth Token: ${token}`);

      try {
        const payload = {
          game_id: Number(gameId),
          page: 1,
          limit: 5,
        };

        console.log("Sending Payload:", payload); 

        const response = await axios.post(
          `${API_URL}/fetch-voucher-transactions`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        setTransactions(response.data.data.transactions);
      } catch (error:any) {
        console.error("Error fetching Transactions:", error);
        toast.error(
          `Failed to fetch transactions: ${error.response?.data?.message || error.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [gameId]); 

  return (
    <div>
      <div className="flex justify-between items-center pb-7">
        <h2 className="text-2xl">Transactions</h2>
        <div>
          <Button text="" />
        </div>
      </div>

      {loading ? (
        <div className="mt-5">
          <Skeleton count={5} height={30} />
        </div>
      ) : transactions && transactions.length > 0 ? (
        <TableComponent data={transactions} />
      ):(  <p>No transactions found.</p>)}
    </div>
  );
};

export default TransactionDetails;
