import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect, useState } from "react";
import gameLogo from "../assets/images/tilil-logo-white.png";
import { getUserProfile } from "../redux/authSlice";
import { NavLink } from "react-router-dom";
import {
  FiChevronRight,
  FiChevronLeft,
  FiFileText,
  FiCheckSquare,
  FiUpload,
  FiBriefcase,
  FiDollarSign,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const roleBasedMenu: Record<string, string[]> = {
  super_admin: ["/", "/uploads", "/tenders", "/institutions", "/transactions", "/user-groups", "/users"],
  admin: ["/tenders", "/transactions", "/users"],
  user: ["/", "/tenders", "/uploads", "/transactions", "/users"],
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const [isInstitutionOpen, setIsInstitutionOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState?.isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, authState?.isAuthenticated]);

  const userRole = authState?.user?.role || "user"; // Default to 'user' if no role exists
  const allowedPaths = roleBasedMenu[userRole] || [];

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#161C2A] text-white p-4 flex flex-col transition-all duration-300 ${isCollapsed ? "w-18" : "w-60"}`}>
      <div className="flex">
        <button className="text-white mb-6 p-2 rounded-md flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-blue-500 font-bold text-lg">
              <img src={gameLogo} alt="logo" />
            </span>
          )}
        </button>
        {isCollapsed ? (
          <FiChevronRight size={24} onClick={() => setIsCollapsed(!isCollapsed)} className="my-14 mb-25" />
        ) : (
          <FiChevronLeft size={140} onClick={() => setIsCollapsed(!isCollapsed)} />
        )}
      </div>

      <ul className="flex flex-col space-y-4">
        {allowedPaths.includes("/") && (
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-800 text-white font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              <MdDashboard size={24} />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
        )}

        {allowedPaths.includes("/uploads") && (
          <li>
            <NavLink
              to="/uploads"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-800 text-white font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              <FiUpload size={24} />
              {!isCollapsed && <span>Upload Documents</span>}
            </NavLink>
          </li>
        )}

        {allowedPaths.includes("/tenders") && (
          <li>
            <NavLink
              to="/tenders"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-800 text-white font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              <FiFileText size={24} />
              {!isCollapsed && <span>Documents</span>}
            </NavLink>
          </li>
        )}

        {allowedPaths.includes("/verify") && (
          <li>
            <NavLink
              to="/verify"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-800 text-white font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              <FiCheckSquare size={24} />
              {!isCollapsed && <span>Verify Documents</span>}
            </NavLink>
          </li>
        )}

        {allowedPaths.includes("/institutions") && (
          <li>
            <NavLink
              to="/institutions"
              end
              className={({ isActive }) =>
                `flex items-center justify-between w-full p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-800 text-white font-bold" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setIsInstitutionOpen(!isInstitutionOpen)}
            >
              <span className="flex items-center space-x-2">
                <FiBriefcase size={24} />
                {!isCollapsed && <span>Institutions</span>}
              </span>
              {!isCollapsed && (isInstitutionOpen ? <FiChevronDown /> : <FiChevronRight />)}
            </NavLink>

            {isInstitutionOpen && !isCollapsed && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <NavLink
                    to="/applications"
                    className={({ isActive }) =>
                      `ml-2 p-2 rounded-md block text-sm ${
                        isActive ? "bg-blue-700 font-semibold" : "hover:bg-gray-600"
                      }`
                    }
                  >
                    Applications
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/institutions/issued-securities"
                    className={({ isActive }) =>
                      `ml-2 p-2 rounded-md block text-sm ${
                        isActive ? "bg-blue-700 font-semibold" : "hover:bg-gray-600"
                      }`
                    }
                  >
                    Issued Securities
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        )}

        {allowedPaths.includes("/transactions") && (
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-800 text-white font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              <FiDollarSign size={24} />
              {!isCollapsed && <span>Transactions</span>}
            </NavLink>
          </li>
        )}

        {allowedPaths.includes("/users") && (
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-800 text-white font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              <FiUser size={24} />
              {!isCollapsed && <span>Users</span>}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;