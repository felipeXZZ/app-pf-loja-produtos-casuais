import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types/Product';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-60 object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-xs uppercase font-bold">
              Fora de Estoque
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-black mb-1">{product.name}</h3>
          <p className="text-xl font-bold text-black mb-2">{formatCurrency(product.price)}</p>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full btn-primary ${
              !product.inStock && 'opacity-50 cursor-not-allowed hover:bg-black hover:text-white hover:border-0'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2 inline-block" />
            Adicionar ao Carrinho
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;