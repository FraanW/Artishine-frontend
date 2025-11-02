import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed md:top-3 sm:top-0 left-0 right-0 z-40 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img
              src="/images/logo.svg"
              alt="Artishine"
              className="h-15 w-20"
            />
            <span className="text-xl font-serif font-bold text-amber-900">
              Artishine
            </span>
          </div>

          {/* Optional: Add any additional header content here */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Future: Add notifications, user menu, etc. */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;