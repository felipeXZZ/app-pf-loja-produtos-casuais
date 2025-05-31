import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, CustomerInfo, OrderItem } from '../../types/Order';
import { useCart } from '../../context/CartContext';
import { saveOrder } from '../../utils/localStorage';
import { 
  formatCPF, 
  formatPhone, 
  formatCEP 
} from '../../utils/formatters';
import { 
  validateEmail, 
  validateCPF, 
  validatePhone, 
  validateCEP, 
  validateRequired 
} from '../../utils/validators';

interface FormErrors {
  [key: string]: string;
}

const CheckoutForm: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CustomerInfo] as object,
          [child]: value
        }
      }));
    } else {
      let formattedValue = value;
      
      // Apply masks
      if (name === 'cpf') {
        formattedValue = formatCPF(value);
      } else if (name === 'phone') {
        formattedValue = formatPhone(value);
      } else if (name === 'address.zipCode') {
        formattedValue = formatCEP(value);
      }
      
      setCustomerInfo(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate personal information
    if (!validateRequired(customerInfo.name)) {
      newErrors['name'] = 'Nome é obrigatório';
    }
    
    if (!validateEmail(customerInfo.email)) {
      newErrors['email'] = 'Email inválido';
    }
    
    if (!validatePhone(customerInfo.phone)) {
      newErrors['phone'] = 'Telefone inválido';
    }
    
    if (!validateCPF(customerInfo.cpf)) {
      newErrors['cpf'] = 'CPF inválido';
    }
    
    // Validate address
    if (!validateRequired(customerInfo.address.street)) {
      newErrors['address.street'] = 'Rua é obrigatória';
    }
    
    if (!validateRequired(customerInfo.address.number)) {
      newErrors['address.number'] = 'Número é obrigatório';
    }
    
    if (!validateRequired(customerInfo.address.neighborhood)) {
      newErrors['address.neighborhood'] = 'Bairro é obrigatório';
    }
    
    if (!validateRequired(customerInfo.address.city)) {
      newErrors['address.city'] = 'Cidade é obrigatória';
    }
    
    if (!validateRequired(customerInfo.address.state)) {
      newErrors['address.state'] = 'Estado é obrigatório';
    }
    
    if (!validateCEP(customerInfo.address.zipCode)) {
      newErrors['address.zipCode'] = 'CEP inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create order items from cart
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));
    
    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      items: orderItems,
      total: getCartTotal(),
      customerInfo,
      status: 'completed'
    };
    
    // Save order to localStorage
    saveOrder(newOrder);
    
    // Clear cart
    clearCart();
    
    // Redirect to order confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/orders', { state: { newOrderId: newOrder.id } });
    }, 1500);
  };
  
  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];
  
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
              CPF*
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={customerInfo.cpf}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.cpf ? 'border-red-500' : ''}`}
            />
            {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Endereço de Entrega</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              Rua*
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={customerInfo.address.street}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors['address.street'] ? 'border-red-500' : ''}`}
            />
            {errors['address.street'] && <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>}
          </div>
          
          <div>
            <label htmlFor="address.number" className="block text-sm font-medium text-gray-700">
              Número*
            </label>
            <input
              type="text"
              id="address.number"
              name="address.number"
              value={customerInfo.address.number}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors['address.number'] ? 'border-red-500' : ''}`}
            />
            {errors['address.number'] && <p className="mt-1 text-sm text-red-600">{errors['address.number']}</p>}
          </div>
          
          <div>
            <label htmlFor="address.complement" className="block text-sm font-medium text-gray-700">
              Complemento
            </label>
            <input
              type="text"
              id="address.complement"
              name="address.complement"
              value={customerInfo.address.complement}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="address.neighborhood" className="block text-sm font-medium text-gray-700">
              Bairro*
            </label>
            <input
              type="text"
              id="address.neighborhood"
              name="address.neighborhood"
              value={customerInfo.address.neighborhood}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors['address.neighborhood'] ? 'border-red-500' : ''}`}
            />
            {errors['address.neighborhood'] && <p className="mt-1 text-sm text-red-600">{errors['address.neighborhood']}</p>}
          </div>
          
          <div>
            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
              Cidade*
            </label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={customerInfo.address.city}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors['address.city'] ? 'border-red-500' : ''}`}
            />
            {errors['address.city'] && <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>}
          </div>
          
          <div>
            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
              Estado*
            </label>
            <select
              id="address.state"
              name="address.state"
              value={customerInfo.address.state}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors['address.state'] ? 'border-red-500' : ''}`}
            >
              <option value="">Selecione um estado</option>
              {brazilianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors['address.state'] && <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>}
          </div>
          
          <div>
            <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
              CEP*
            </label>
            <input
              type="text"
              id="address.zipCode"
              name="address.zipCode"
              value={customerInfo.address.zipCode}
              onChange={handleInputChange}
              placeholder="00000-000"
              maxLength={9}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors['address.zipCode'] ? 'border-red-500' : ''}`}
            />
            {errors['address.zipCode'] && <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || cartItems.length === 0}
          className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white ${
            isSubmitting || cartItems.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400'
          }`}
        >
          {isSubmitting ? 'Processando...' : 'Finalizar Compra'}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;