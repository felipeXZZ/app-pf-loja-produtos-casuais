import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Order } from '../../types/Order';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface OrderCardProps {
  order: Order;
  isNew?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isNew = false }) => {
  const [isExpanded, setIsExpanded] = useState(isNew);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 mb-4 ${
      isNew ? 'ring-2 ring-black' : ''
    }`}>
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Package className="h-6 w-6 text-black" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Pedido #{order.id.substring(order.id.length - 5)}
            </p>
            <p className="text-lg font-bold text-black">{formatCurrency(order.total)}</p>
            <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
            order.status === 'delivered' 
              ? 'bg-green-100 text-green-800' 
              : order.status === 'processing' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-black'
          }`}>
            {order.status === 'delivered' 
              ? 'Entregue' 
              : order.status === 'processing' 
                ? 'Em processamento' 
                : 'Concluído'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-black ml-4" />
          ) : (
            <ChevronDown className="h-5 w-5 text-black ml-4" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Produtos</h3>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="text-sm font-medium text-black">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Informações Pessoais</h3>
              <p className="text-sm text-black">{order.customerInfo.name}</p>
              <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
              <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Endereço de Entrega</h3>
              <p className="text-sm text-black">
                {order.customerInfo.address.street}, {order.customerInfo.address.number}
                {order.customerInfo.address.complement && `, ${order.customerInfo.address.complement}`}
              </p>
              <p className="text-sm text-gray-600">
                {order.customerInfo.address.neighborhood}, {order.customerInfo.address.city} - {order.customerInfo.address.state}
              </p>
              <p className="text-sm text-gray-600">{order.customerInfo.address.zipCode}</p>
            </div>
          </div>
        </div>
      )}
      
      {isNew && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-black font-medium">
            Pedido realizado com sucesso! Você receberá atualizações por email.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderCard;