import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-4 px-6 fixed top-0 left-0 w-full z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Ticket Marketplace</h1>
        <div className="space-x-6">
          <Link
            to="/"
            className="text-white font-medium px-4 py-2 rounded-md transition-all duration-300 hover:bg-white hover:text-blue-600"
          >
            Acasa
          </Link>
          <Link
            to="/profile"
            className="text-white font-medium px-4 py-2 rounded-md transition-all duration-300 hover:bg-white hover:text-blue-600"
          >
            Profil
          </Link>
          <Link
            to="/create"
            className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-md transition-all duration-300 hover:bg-gray-200"
          >
            + Creaza event
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
