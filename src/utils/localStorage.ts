import { Order } from '../types/Order';

// Orders
export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const getOrderById = (orderId: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};