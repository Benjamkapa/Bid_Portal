import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import TableComponent from "../../components/grid/GamesTable";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_URL = import.meta.env.VITE_API_URL;
const Games = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  
  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `${API_URL}/games/fetch-admin-games`,
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

    fetchGames(); // <-- Call the fetchGames function here
  }, []); // <-- Closing bracket for useEffect

  // Open and close modal
  const handleOpenModal = (game:any) => {
    setSelectedGame(game); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-7">
        <h2 className="text-2xl">Games List</h2>
        <div>
          <Button text="Create Game"  onClick={handleOpenModal} />
        </div>
      </div>

      {loading ? (
        <div className="mt-5">
          <Skeleton count={8} height={35} />
        </div>
      ) : (
        <TableComponent data={games} handleOpenModal={handleOpenModal} />
      )}
      {/* <GamesModal isOpen={isModalOpen}  onClose={handleCloseModal} refreshGames={fetchGames} /> */}

      {/* <GamesModal isOpen={isModalOpen} onClose={handleCloseModal} game={selectedGame}  refreshGames={fetchGames} /> */}
    </div>
  );
}

export default Games;