import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import TableComponent from "../../components/grid/GamesTable";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import GamesModal from "../../components/modal/GamesModal";

const API_URL = import.meta.env.VITE_API_URL;
const Transactions= () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `${API_URL}/games/fetch-games`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGames(response.data.data.games);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false); // Stop loading once request completes
      }
    };

    fetchGames();
  }, []);



  // Open and close modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  return (
    <div>
      <div className="flex justify-between items-center pb-7">
        <h2 className="text-2xl"> View Transactions per game</h2>
        <div>
          <Button text="Create Game"  onClick={handleOpenModal} />
        </div>
      </div>

      {/* Show Skeleton when loading */}
      {loading ? (

        <div className="mt-5">
        <Skeleton count={8} height={35} />
      </div>
      ) : (
        <TableComponent data={games} />
      )}
      <GamesModal isOpen={isModalOpen}  onClose={handleCloseModal} />

    </div>
  );
};

export default Transactions;
