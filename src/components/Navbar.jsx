import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  // Automatically close mobile menu on resize to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowMenu(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setShowMenu((prev) => !prev);
  const closeMenu = () => setShowMenu(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-amber-300/5 backdrop-blur-2xl shadow-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img
            src="/con_1.png"
            alt="ClimaQuest logo"
            className="h-6 w-6 md:h-10 md:w-10"
          />
          <h1 className="font-montserrat text-2xl md:text-3xl font-bold tracking-tight">
            ClimaQuest
          </h1>
        </div>

        {/* Navigation */}
        <nav className="relative">
          {/* Hamburger Button  */}
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={showMenu}
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"    
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation Links */}
          <ul
            className={`${
              showMenu ? "flex opacity-100" : "hidden opacity-0 md:opacity-100"
            } 
            absolute md:static right-0 mt-2 md:mt-0 bg-white md:bg-transparent shadow-2xl md:shadow-none rounded-lg md:rounded-none w-55 md:w-auto flex-col md:flex-row md:space-x-6 p-4 md:p-0 transition-opacity duration-300  md:flex justify-center h-60  md:h-8 text-center `}
          >


  <li>
             <Link to="/dashboard"   onClick={closeMenu}
                  className="block px-2 py-2 hover:underline underline-offset-4 hover:text-green-600 transition duration-300  font-semibold"
                >Dashboard</Link>
           </li>
           <li>
             <Link to="/weather"   onClick={closeMenu}
                  className="block px-2 py-2 hover:underline underline-offset-4 hover:text-green-400 transition duration-300  font-semibold"
                >Weather Details</Link>
           </li>
           <li>
             <Link to="/trip"   onClick={closeMenu}
                  className="block px-2 py-2 hover:underline underline-offset-4 hover:text-green-400 transition duration-300  font-semibold"
                >Trip Planner</Link>
           </li>
           <li>
             <Link to="/favorites"   onClick={closeMenu}
                  className="block px-2 py-2 hover:underline underline-offset-4 hover:text-green-400 transition duration-300  font-semibold"
                >Favorite</Link>
           </li>
           <li>
             <Link to="/about"   onClick={closeMenu}
                  className="block px-2 py-2 hover:underline underline-offset-4 hover:text-green-400 transition duration-300   font-semibold"
                >About</Link>
           </li>




          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
