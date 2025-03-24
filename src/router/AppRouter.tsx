import { createBrowserRouter } from "react-router-dom";
import "../App.css";
import Home from "../pages/Home";
import AdminDashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/Auth/Login";
import Logon from "../pages/Auth/Logon";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyDocuments from "../pages/modules/Verify";
import TenderUploads from "../pages/modules/TenderUploads";
import PrivateRoute from "../components/PrivateRoute";
import Documents from "../pages/modules/Documents";
import Institution from "../pages/modules/Institution";
import Transaction from "../pages/modules/Transaction";
import UserGroups from "../pages/modules/UserGroups";
import Users from "../pages/modules/Users";

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
      // <PrivateRoute>
        <Home />
      // </PrivateRoute>
    ),
    errorElement: <div>Error, Page not found</div>,
    children: [
      {
        path: "/dashboard",
        element: (
          // <PrivateRoute>
            <AdminDashboard />
          //  </PrivateRoute>
        ),
      },
      {
        path: "/uploads",
        element: (
          // <PrivateRoute>
            <TenderUploads />
          // </PrivateRoute>
        ),
      },
      {
        path: "/documents",
        element: (
        //  <PrivateRoute>
            <Documents />
        //  </PrivateRoute>
        ),
      },
      {
        path: "/verify",
        element: (
          // <PrivateRoute>
            <VerifyDocuments />
          // </PrivateRoute>
        ),
      },
      {
        path: "/institutions",
        element: (
          // <PrivateRoute>
            <Institution />
          // </PrivateRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          // <PrivateRoute>
            <Transaction />
          // </PrivateRoute>
        ),
      },
      {
        path: "/user-groups",
        element: (
          // <PrivateRoute>
            <UserGroups />
          // </PrivateRoute>
        ),
      },
      {
        path: "/users",
        element: (
          // <PrivateRoute>
            <Users />
          // </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;

