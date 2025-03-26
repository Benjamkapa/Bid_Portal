


import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect } from "react";
import { getUserProfile } from "../redux/authSlice";
import { NavLink } from "react-router-dom";
import {
  FiChevronRight,
  FiChevronLeft,
  FiHome,
  FiFileText,
  FiCheckSquare,
  FiUpload,
  FiBriefcase,
  FiDollarSign,
  FiUsers,
  FiUser,
} from "react-icons/fi";
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}
const menuItems = [
  { icon: <FiHome size={24} />, label: "Dashboard", path: "/" },
  { icon: <FiUpload size={24} />, label: "Upload Tenders", path: "/uploads" },
  { icon: <FiFileText size={24} />, label: "Tenders", path: "/tenders" },
  { icon: <FiCheckSquare size={24} />, label: "Verify Documents", path: "/verify" },
  { icon: <FiBriefcase size={24} />, label: "Institutions", path: "/institutions" },
  { icon: <FiDollarSign size={24} />, label: "Transactions", path: "/transactions" },
  // { icon: <FiUsers size={24} />, label: "User Groups", path: "/user-groups" },
  { icon: <FiUser size={24} />, label: "Users", path: "/users" },
];

const roleBasedMenu: Record<string, string[]> = {
  super_admin: ["/",  "/uploads","/tenders", "/institutions", "/transactions", "/user-groups", "/users"],
  admin: ["/tenders", "/transactions","/users"],
  user: ["/", "/tenders","/uploads", "/transactions","/users"],
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState?.isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, authState?.isAuthenticated]);

  const userRole = authState?.user?.role || "user"; // Default to 'user' if no role exists
  const allowedPaths = roleBasedMenu[userRole] || [];
  const filteredMenuItems = menuItems.filter((item) => allowedPaths.includes(item.path));

  return (
    <div className={`fixed top-0 left-0 h-screen  bg-gray-800 text-white p-4 flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"}`}>
      {/* Sidebar Toggle Button */}
      <button
        className="text-white mb-6 p-2 bg-gray-700 rounded-md flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed && <span className="text-blue-500 font-bold text-lg">Bid Portal</span>}
        {isCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
      </button>

      {/* Menu Items */}
      <ul className="flex flex-col space-y-4">
        {filteredMenuItems.map((item, index) => (
          <li key={index} className="relative group">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-blue-500 text-black font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>

            {/* Tooltip (Only visible when collapsed) */}
            {isCollapsed && (
              <span className="absolute left-10 bg-black text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
