import { createBrowserRouter } from "react-router-dom";
import "../App.css";
import Home from "../pages/Home";
import Index from "../pages/dashboard/Index";

import Login from "../pages/Auth/Login";
import Players from "../pages/players/Players";
import Games from "../pages/games/Games";
import Transactions from "../pages/transactions/Transactions";
import Settings from "../pages/settings/Settings";
import Reports from "../pages/reports/Reports";
import GameDetails from "../pages/games/GameDetails";
import TransactionDetails from "../pages/transactions/TransactionDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div>Error,Page not found</div>,
    children: [
        {
            path:"/",
            element:<Index/>
        },
        {
            path:"/games",
            element:<Games/>

        },
        {
            path:"/games/:gameId",
            element:<GameDetails/>


        },
        {
            path:"/players",
            element:<Players/>
        },
       
        {
            path:"/transactions",
            element:<Transactions/>
        },

        {
            path:"/transactions/:gameId",
            element:<TransactionDetails/>


        },

        
        {
            path:"/reports",
            element:<Reports/>
        },
        {
            path:"/settings",
            element:<Settings/>
        }


    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;