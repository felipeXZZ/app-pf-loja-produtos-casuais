import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const Checkout: React.FC = () => {
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
  onClick={() => navigate('/cart')}
  className="inline-flex items-center mb-8 text-black hover:text-gray-600">
        <ArrowLeft className="h-5 w-5 mr-1" />
        Voltar
      </button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Total do pedido</h2>
            
            <div className="max-h-80 overflow-y-auto mb-6 pr-2">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex py-4 border-b border-gray-200">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="line-clamp-1">{item.product.name}</h3>
                        <p className="ml-4">{formatCurrency(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Quantidade {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frete</span>
                <span className="text-gray-900 font-medium">Grátis</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-black">{formatCurrency(getCartTotal())}</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center">
              <ShoppingBag className="h-6 w-6 text-black mr-2" />
              <span className="text-sm text-gray-600">
                {cartItems.reduce((total, item) => total + item.quantity, 0)} Itens em seu carrinho
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;