import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const productId = parseInt(id || '0');
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">Produto Não Encontrado</h1>
        <p className="text-gray-600 mb-8">O produto que você está procurando não existe.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para Produtos
        </button>
      </div>
    );
  }
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center mb-8 text-black hover:text-gray-600"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Voltar para Produtos
      </button>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="p-8 flex flex-col">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-black mb-6">{formatCurrency(product.price)}</p>
              
              <div className="border-t border-b border-gray-200 py-6 my-6">
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-black">Categoria</h3>
                <p className="mt-1 text-sm text-gray-600 capitalize">
                  {product.category.replace('-', ' ')}
                </p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-black">Disponibilidade</h3>
                <p className={`mt-1 text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                </p>
              </div>
            </div>
            
            {product.inStock && (
              <div className="mt-8">
                <div className="flex items-center mb-6">
                  <span className="mr-4 text-black">Quantidade:</span>
                  <div className="flex items-center border-2 border-black rounded-lg">
                    <button 
                      onClick={decrementQuantity}
                      className="px-3 py-1 text-black hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 text-black font-medium">{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      className="px-3 py-1 text-black hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary inline-flex justify-center items-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="btn-secondary"
                  >
                    Ver Carrinho
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;