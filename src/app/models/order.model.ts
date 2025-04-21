export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: number;
    username: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    orderItems: OrderItem[];
  }
  export interface OrderItemWithDetails extends OrderItem {
    name: string;
  }