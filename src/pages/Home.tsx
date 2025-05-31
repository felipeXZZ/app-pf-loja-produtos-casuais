import React, { useState } from 'react';
import { Grid, List, Filter, ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { products } from '../data/products';
import { formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  
  const categories = [...new Set(products.map(product => product.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
      : true;
    
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">ModaCasual</h1>
          <p className="mt-2 text-lg text-black">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : selectedCategory
                ? `Navegando em ${selectedCategory.replace(/-/g, ' ')}`
                : 'Todos os Produtos'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-black">Visualização:</span>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md focus:outline-none ${
                viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              <Grid className="h-5 w-5 text-black" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md focus:outline-none ${
                viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              <List className="h-5 w-5 text-black" />
            </button>
          </div>
          
          <div className="relative inline-block">
            <select
              className="appearance-none block pl-3 pr-10 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm text-black"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" className="text-black">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category} className="text-black">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-black mb-2">Nenhum produto encontrado</h2>
          <p className="text-gray-600">Tente buscar por outros termos ou remover os filtros aplicados.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="flex bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="w-40 h-40 flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-black hover:text-gray-800 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="mt-1 text-sm text-black line-clamp-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-xl font-bold text-black">
                    {formatCurrency(product.price)}
                  </p>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-white hover:text-black hover:border-black"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;