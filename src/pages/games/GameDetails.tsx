import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

type Category = {
  category_id: number;
  category_name: string;
  gc_description: string;
  gc_status: number;
};

const GameCategoryCard = ({
  category,
  onDeactivate,
}: {
  category: Category;
  onDeactivate: (category: Category) => void;
}) => {
  const [isActive, setIsActive] = useState(category.gc_status === 1);
  const [showDialog, setShowDialog] = useState(false);

  const handleToggleClick = () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      setShowDialog(true);
    }
  };

  const confirmDeactivation = () => {
    setIsActive(false);
    setShowDialog(false);
    onDeactivate(category);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative bg-white shadow-lg rounded-2xl p-4 cursor-pointer hover:shadow-2xl transition"
    >
      <h3 className="text-xl font-bold">{category.category_name}</h3>
      <p className="text-gray-600">{category.gc_description}</p>
      <button
        onClick={handleToggleClick}
        className={`mt-4 px-4 py-2 text-white rounded-lg ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>

        <h2 className="text-lg font-bold">Confirm Deactivation</h2>
        <p className="mt-2">
          Are you sure you want to deactivate {category.category_name}?
        </p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={() => setShowDialog(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeactivation}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Deactivate
          </button>
        </div>
  
    </motion.div>
  );
};
const API_URL = import.meta.env.VITE_API_URL;

const GameDetails = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { gameId } = useParams();
  console.log("Game ID:", gameId);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const body = JSON.stringify({
          game_id: gameId,
        });
        const response = await axios.post(
          `${API_URL}/games/fetch-game-categories`,

          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("categories  are", response);

        if (response.status === 200 && response.data.success) {
          setCategories(response.data.data);
        } else {
          console.error("API error:", response.data);
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
        console.error(
          "Error fetching categories:",
          error.response.data.message
        );
      }
    };

    fetchCategories();
  }, [gameId]); // Add gameId to the dependency array

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {categories.map((category) => (
        <GameCategoryCard
          key={category.category_id}
          category={category}
          onDeactivate={() => {}}
        />
      ))}
    </div>
  );
};

export default GameDetails;
