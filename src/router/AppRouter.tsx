import { createBrowserRouter } from "react-router-dom";
import "../App.css";
import Home from "../pages/Home";
import AdminDashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/Auth/Login";
import Logon from "../pages/Auth/Logon";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Players from "../pages/players/Players";
import Games from "../pages/games/Games";
import Settings from "../pages/settings/Settings";
import Reports from "../pages/reports/Reports";
import GameDetails from "../pages/games/GameDetails";
import PrivateRoute from "../components/PrivateRoute";
import ValidateDocuments from "../pages/Auth/ValidateDocument";
import TenderDetailsPage from "../pages/Tenders/TenderDetailsPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logon",
    element: <Logon />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: (
    //   <PrivateRoute>
        <Home />
    //   </PrivateRoute>
    ),
    errorElement: <div>Error, Page not found</div>,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/games",
        element: (
          <PrivateRoute>
            <Games />
          </PrivateRoute>
        ),
      },
      {
        path: "/games/:gameId",
        element: (
          <PrivateRoute>
            <GameDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/players",
        element: (
          <PrivateRoute>
            <Players />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
        //   <PrivateRoute>
            <AdminDashboard />
        //   </PrivateRoute>
        ),
      },
      {
        path: "/tender-details",
        element: (
        //   <PrivateRoute>
            <TenderDetailsPage />
        //   </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "/validate-documents",
        element: (
          <PrivateRoute>
            <ValidateDocuments />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;