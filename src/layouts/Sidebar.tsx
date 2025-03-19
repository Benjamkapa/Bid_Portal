
import { NavLink } from "react-router-dom";
import {
  BsFillGearFill,
  BsFillGrid3X3GapFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsPeopleFill,
} from "react-icons/bs";
import { FiMenu, FiHome } from "react-icons/fi";
import { IoGameController } from "react-icons/io5";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { icon: <FiHome size={24} />, label: "Dashboard", path: "/" },
  { icon: <IoGameController size={24} />, label: "Games", path: "/games" },
  // { icon: <BsFillGrid3X3GapFill size={24} />, label: "Categories", path: "/categories" },
  { icon: <BsPeopleFill size={24} />, label: "Players", path: "/players" },
  { icon: <BsListCheck size={24} />, label: "Transactions", path: "/transactions" },
  { icon: <BsMenuButtonWideFill size={24} />, label: "Reports", path: "/reports" },
  { icon: <BsFillGearFill size={24} />, label: "Settings", path: "/settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Sidebar Toggle Button */}
      <button
        className="text-white mb-6 p-2 bg-gray-700 rounded-md flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed && <span className="text-yellow-500 font-bold text-lg">Bonanza</span>}
        <FiMenu size={24} />
      </button>

      {/* Menu Items */}
      <ul className="flex flex-col space-y-4">
        {menuItems.map((item, index) => (
          <li key={index} className="relative group">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-yellow-500 text-black font-bold" : "hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>

            {/* Tooltip (Only visible when collapsed) */}
            {isCollapsed && (
              <span className="absolute left-12 bg-black text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
