

interface NavbarProps {
    isCollapsed: boolean;
  }
  
  const Navbar: React.FC<NavbarProps> = ({ isCollapsed }) => {
    return (
      <div
        className={`fixed top-0 h-16 bg-white text-black flex items-center justify-between  px-6 transition-all duration-300 ${
          isCollapsed ? "left-20 w-[calc(100%-80px)]" : "left-60 w-[calc(100%-240px)]"
        }`}
      >
               <h1 className="text-lg font-bold">
            Welcome John Doe!
        </h1>
        
   

<button className="px-5 py-2 bg-yellow-500 rounded-full cursor-pointer">Logout</button>
   
      </div>
    );
  };
  
  export default Navbar;
  