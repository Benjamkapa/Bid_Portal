import { createBrowserRouter } from "react-router-dom";
import "../App.css";
import Home from "../pages/Home";
import AdminDashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/Auth/Login";
import Logon from "../pages/Auth/Logon";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyDocuments from "../pages/modules/Verify";
import TenderUploads from "../pages/modules/TenderUploads";
import Tenders from "../pages/modules/Tenders";
import Institution from "../pages/modules/Institution";
import Transaction from "../pages/modules/Transaction";
import UserGroups from "../pages/modules/UserGroups";
import Users from "../pages/modules/Users";
import PrivateRoute from "./PrivateRoute";


const router = createBrowserRouter([
  {
    path: "/login",

    element: <Login/>

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


    element: <PrivateRoute><Home /></PrivateRoute>,
    errorElement: <div>Error, Page not found</div>,
    children: [
      {
        path: "/",
        element: (
          
            <AdminDashboard />
          
        ),
      },
      {
        path: "/uploads",
        element: (<TenderUploads />),
      },
      {
        path: "/uploads/:tenderNo",
        element: (<TenderUploads />),
      },
      {
        path: "/tenders",
        element: (
       
            <Tenders />
        
        ),
      },
      {
        path: "/verify",
        element: (
          
            <VerifyDocuments />
          
        ),
      },
      {
        path: "/institutions",
        element: (
          
            <Institution />
          
        ),
      },
      {
        path: "/transactions",
        element: (
          
            <Transaction />
          
        ),
      },
      {
        path: "/user-groups",
        element: (
          
            <UserGroups />
          
        ),
      },
      {
        path: "/users",
        element: (
          
            <Users />
          
        ),
      },
    ],
  },
]);

export default router;

