import { useEffect, useState } from "react";
import Button from "../button/Button";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

interface Game {
  game_id?: number;
  game_name: string;
  game_description: string;
  winner_amount: number;
  win_factor: number;
  createdby: number;
  game_status: number;
}

interface GamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game | null; 
  refreshGames: () => void; 
}

const GamesModal = ({ isOpen, onClose, game ,refreshGames }: GamesModalProps) => {

  // console.log("game is",game);
  if (!isOpen) return null; 
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState<Game>({
    game_name: "",
    game_description: "",
    winner_amount: 0,
    win_factor: 0,
    createdby: 1,
    game_status: 1,
  });

  useEffect(() => {
    if (game?.game_id) {
      setGameData(game);
    } else {
      setGameData({
        game_name: "",
        game_description: "",
        winner_amount: 0,
        win_factor: 0,
        createdby: 1,
        game_status: 1,
      });
    }
  }, [game]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGameData({
      ...gameData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    try {
      setLoading(true);
      const url = game?.game_id ? `${API_URL}/update-game` : `${API_URL}/insert-game`;
      const method = game?.game_id ? "PUT" : "POST";

      await axios({
        method,
        url,
        data: gameData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    
      toast.success(game?.game_id ? "Game updated successfully" : "Game created successfully");
      refreshGames();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error processing request");
      } else {
        toast.error("Error processing request");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="game_modal" className="modal" open={isOpen}>
      <div className="modal-box">
        <form method="dialog">
          <button className="btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{game?.game_id ? "Edit Game" : "Create Game"}</h3>
        <div className="space-y-6 mt-4">
          <div>
            <p>Game Name</p>
            <input
              type="text"
              name="game_name"
              placeholder="Enter game name"
              className="border w-full p-2 rounded focus:border-red-500"
              value={gameData.game_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>Game Description</p>
            <input
              type="text"
              name="game_description"
              placeholder="Enter game description"
              className="border w-full p-2 rounded focus:border-red-500"
              value={gameData.game_description}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>Winner Amount</p>
            <input
              type="number"
              name="winner_amount"
              placeholder="Enter winner amount"
              className="border w-full p-2 rounded focus:border-red-500"
              value={gameData.winner_amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>Win Factor</p>
            <input
              type="number"
              name="win_factor"
              placeholder="Enter win factor"
              className="border w-full p-2 rounded focus:border-red-500"
              value={gameData.win_factor}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>Game Status</p>
            <select
              name="game_status"
              className="border w-full p-2 rounded "
              value={gameData.game_status}
              onChange={handleChange}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button color={game?.game_id ? "bg-green-500":"bg-red-500"} width="1/2" text={game?.game_id ? "Update Game" : "Create Game"} onClick={handleSubmit} isLoading={loading} />
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default GamesModal;
