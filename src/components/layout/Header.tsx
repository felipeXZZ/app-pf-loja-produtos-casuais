import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setSearchParams({});
      navigate('/');
    }
  };
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">ModaCasual</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-black hover:text-gray-600 transition-colors px-3 py-2 font-medium">
              Início
            </Link>
            <Link to="/orders" className="text-black hover:text-gray-600 transition-colors px-3 py-2 font-medium">
              Pedidos
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                type="submit"
                className="p-2 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            <Link to="/cart" className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <form onSubmit={handleSearch} className="flex items-center mr-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="px-3 py-1 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="p-1 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            <Link to="/cart" className="p-2 mr-2 relative">
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-black hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-lg text-base font-medium text-black hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/orders" 
              className="block px-3 py-2 rounded-lg text-base font-medium text-black hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Pedidos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;