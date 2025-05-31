import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const Cart: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const isCartEmpty = cartItems.length === 0;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-black mb-8">Carrinho de Compras</h1>
      
      {isCartEmpty ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-black" />
          </div>
          <h2 className="text-2xl font-semibold text-black mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Parece que você ainda não adicionou nenhum produto ao seu carrinho.</p>
          <Link to="/" className="btn-primary">
            Começar a Comprar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium text-black">
                  Itens ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-black hover:text-gray-600"
                >
                  Limpar Carrinho
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <div key={item.product.id} className="px-6">
                    <CartItem product={item.product} quantity={item.quantity} />
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200">
                <Link 
                  to="/"
                  className="inline-flex items-center text-black hover:text-gray-600"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-medium text-black mb-6">Resumo do Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-black font-medium">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-black font-medium">Grátis</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-black">Total</span>
                  <span className="text-lg font-bold text-black">{formatCurrency(getCartTotal())}</span>
                </div>
              </div>
              
              <button
  onClick={() => navigate('/checkout')}
  className="mt-6 w-full inline-flex justify-center items-center bg-green-400 text-white rounded-lg px-6 py-3 font-medium hover:bg-green-500 transition-all duration-200">
  Finalizar Compra
  <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;