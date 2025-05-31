export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'completed' | 'processing' | 'delivered';
}