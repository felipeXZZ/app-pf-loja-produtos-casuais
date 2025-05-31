import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShoppingCart } from 'lucide-react';
import OrderCard from '../components/orders/OrderCard';
import { getOrders } from '../utils/localStorage';
import { Order } from '../types/Order';

const OrderHistory: React.FC = () => {
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;
  
  const orders: Order[] = getOrders().sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  useEffect(() => {
    if (newOrderId) {
      window.scrollTo(0, 0);
    }
  }, [newOrderId]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        to="/"
        className="inline-flex items-center mb-8 text-black hover:text-gray-600"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Voltar para Produtos
      </Link>
      
      <h1 className="text-3xl font-bold text-black mb-8">Histórico de Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-black" />
          </div>
          <h2 className="text-2xl font-semibold text-black mb-2">Nenhum pedido ainda</h2>
          <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido.</p>
          <Link 
            to="/"
            className="btn-primary inline-flex items-center"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Começar a Comprar
          </Link>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order}
              isNew={order.id === newOrderId} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;