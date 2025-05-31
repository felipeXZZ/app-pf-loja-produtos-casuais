import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { Product } from '../../types/Product';

interface CartItemProps {
  product: Product;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ product, quantity }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(product.id);
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-200">
      <div className="flex items-center flex-1">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="ml-4">
          <h3 className="text-base font-medium text-black">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Preço unitário: {formatCurrency(product.price)}</p>
        </div>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0">
        <div className="flex items-center border-2 border-black rounded-lg">
          <button 
            onClick={handleDecrement}
            className="p-1 text-black hover:bg-gray-100 focus:outline-none rounded-l-lg"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-medium">{quantity}</span>
          <button 
            onClick={handleIncrement}
            className="p-1 text-black hover:bg-gray-100 focus:outline-none rounded-r-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="ml-6 text-right">
          <p className="font-bold text-lg text-black">{formatCurrency(product.price * quantity)}</p>
          <button 
            onClick={handleRemove}
            className="text-black hover:text-gray-600 text-sm flex items-center mt-1"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;