import { apiClient, UserProfile } from './authApi';
import { ProductItem, Category } from './adminApi';

export interface VendorDashboardStats {
  total_products: number;
  active_products: number;
  pending_products: number;
  vendor_orders: number;
}

export interface VendorDashboardResponse {
  stats: VendorDashboardStats;
}

export interface VendorProfileResponse {
  user: UserProfile;
  message?: string;
}

export interface VendorProductsResponse {
  products: ProductItem[];
}

export interface VendorProductResponse {
  product: ProductItem;
  message?: string;
}

export interface VendorCategoriesResponse {
  categories: Category[];
}

export interface OrderItemRecord {
  id: number;
  order_id: number;
  product_id: number;
  vendor_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: {
    id: number;
    title: string;
  };
}

export interface OrderRecord {
  id: number;
  customer_id: number;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    name: string;
    email: string;
  };
  items?: OrderItemRecord[];
}

export interface VendorOrdersResponse {
  orders: OrderRecord[];
}

export interface VendorOrderResponse {
  order: OrderRecord;
  message?: string;
}

export async function fetchVendorDashboardStats(): Promise<VendorDashboardStats> {
  const response = await apiClient.get<VendorDashboardResponse>('/vendor/dashboard');
  return response.data.stats;
}

export async function fetchVendorProfile(): Promise<UserProfile> {
  const response = await apiClient.get<VendorProfileResponse>('/vendor/profile');
  return response.data.user;
}

export async function updateVendorProfile(data: { name: string; email: string }): Promise<UserProfile> {
  const response = await apiClient.put<VendorProfileResponse>('/vendor/profile', data);
  return response.data.user;
}

// Vendor Product API Methods
export async function fetchVendorProducts(): Promise<ProductItem[]> {
  const response = await apiClient.get<VendorProductsResponse>('/vendor/products');
  return response.data.products;
}

export async function fetchVendorProductDetails(id: number): Promise<ProductItem> {
  const response = await apiClient.get<VendorProductResponse>(`/vendor/products/${id}`);
  return response.data.product;
}

export async function createVendorProduct(data: {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  category_id?: number | null;
}): Promise<ProductItem> {
  const response = await apiClient.post<VendorProductResponse>('/vendor/products', data);
  return response.data.product;
}

export async function updateVendorProduct(
  id: number,
  data: {
    title: string;
    description?: string;
    price: number;
    stock?: number;
    category_id?: number | null;
  }
): Promise<ProductItem> {
  const response = await apiClient.put<VendorProductResponse>(`/vendor/products/${id}`, data);
  return response.data.product;
}

export async function updateVendorProductStock(id: number, stock: number): Promise<ProductItem> {
  const response = await apiClient.post<VendorProductResponse>(`/vendor/products/${id}/stock`, { stock });
  return response.data.product;
}

export async function fetchVendorCategories(): Promise<Category[]> {
  const response = await apiClient.get<VendorCategoriesResponse>('/vendor/categories');
  return response.data.categories;
}

// Vendor Order API Methods
export async function fetchVendorOrders(): Promise<OrderRecord[]> {
  const response = await apiClient.get<VendorOrdersResponse>('/vendor/orders');
  return response.data.orders;
}

export async function fetchVendorOrderDetails(id: number): Promise<OrderRecord> {
  const response = await apiClient.get<VendorOrderResponse>(`/vendor/orders/${id}`);
  return response.data.order;
}

export async function updateVendorOrderStatus(
  id: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
): Promise<OrderRecord> {
  const response = await apiClient.post<VendorOrderResponse>(`/vendor/orders/${id}/status`, { status });
  return response.data.order;
}
