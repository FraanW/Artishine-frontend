import React from 'react';
import { Upload, Package, TrendingUp, BarChart3, User, MapPin, Compass, ShoppingCart, LogOut, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    // Navigate to home page
    navigate('/');
  };

  const artisanNavItems = [
    { icon: <Upload className="h-5 w-5" />, label: 'Upload', path: '/upload' },
    { icon: <Package className="h-5 w-5" />, label: 'Products', path: '/manage-products' },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Orders', path: '/orders' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', path: '/analytics' },
    { icon: <User className="h-5 w-5" />, label: 'Profile', path: '/profile-artisan' },
  ];

  const buyerNavItems = [
    { icon: <MapPin className="h-5 w-5" />, label: 'Map', path: '/map' },
    { icon: <Compass className="h-5 w-5" />, label: 'Explore', path: '/explore' },
    { icon: <Heart className="h-5 w-5" />, label: 'Wishlist', path: '/cart' },
    { icon: <User className="h-5 w-5" />, label: 'Profile', path: '/profile' },
  ];

  const navItems = userRole === 'artisan' ? artisanNavItems : buyerNavItems;

  return (
    <nav
      className={
        // Mobile: bottom navbar; Desktop: top-centered pill navbar
        "fixed z-50 border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 " +
        "bottom-0 left-0 right-0 border-t md:bottom-auto md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:rounded-full md:border md:shadow-elegant"
      }
    >
      <div className="flex items-center justify-around md:justify-center md:space-x-1 py-2 px-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={
                "group relative inline-flex items-center md:flex-row flex-col md:px-4 md:py-2 p-3 rounded-full transition-all duration-300 " +
                (isActive
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/10")
              }
            >
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 md:group-hover:translate-y-0">
                {item.icon}
              </span>
              <span className="text-xs md:text-sm md:ml-2 mt-1 md:mt-0">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 md:-bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary md:top-auto md:h-[3px]" />
              )}
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="group relative inline-flex items-center md:flex-row flex-col md:px-4 md:py-2 p-3 rounded-full text-muted-foreground hover:text-destructive transition-all duration-300"
        >
          <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs md:text-sm md:ml-2 mt-1 md:mt-0">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;


