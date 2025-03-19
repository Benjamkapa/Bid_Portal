import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";

const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex">
      {/* Sidebar with Toggle */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar that shrinks with the sidebar */}
        <Navbar isCollapsed={isCollapsed} />
        {/* Main Content */}
        <div
          className={`flex-1 p-6 mt-16 transition-all duration-300 bg-gray-100 ${
            isCollapsed ? "ml-20" : "ml-60"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;

