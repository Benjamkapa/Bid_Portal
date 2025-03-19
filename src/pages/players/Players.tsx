import { useEffect, useState } from "react";

import Button from "../../components/button/Button";
import TableComponent from "../../components/grid/PlayersTable";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const API_URL = import.meta.env.VITE_API_URL;
const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `${API_URL}/fetch-players`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlayers(response.data.data.games);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false); // Stop loading once request completes
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center pb-7">
        <h2 className="text-2xl">Players List</h2>
        <div>
          <Button text="Add Player" />
        </div>
      </div>

      {/* Show Skeleton when loading */}
      {loading ? (

        <div className="mt-5">
        <Skeleton count={5} height={30} />
      </div>
      ) : (
        <TableComponent data={players} />
      )}
    </div>
  );
};

export default Players;
