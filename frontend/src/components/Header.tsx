import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">PC Parts Paradise</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/sell" className="hover:text-gray-300">Sell</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-gray-300">Cart</Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button onClick={logout} className="hover:text-gray-300">Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-300">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-300">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
