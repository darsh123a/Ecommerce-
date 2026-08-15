import { apiClient, UserProfile } from './authApi';

export interface AdminDashboardStats {
  total_customers: number;
  total_vendors: number;
  total_products: number;
  pending_approvals: number;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
}

export interface VendorsResponse {
  vendors: UserProfile[];
}

export interface VendorResponse {
  vendor: UserProfile;
  message?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryResponse {
  category: Category;
  message?: string;
}

export interface CategoryRequestItem {
  id: number;
  vendor_id: number;
  name: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  vendor?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CategoryRequestsResponse {
  requests: CategoryRequestItem[];
}

export interface ProductItem {
  id: number;
  vendor_id: number;
  category_id: number | null;
  title: string;
  description: string | null;
  price: number;
  status: 'pending' | 'active' | 'rejected' | 'inactive';
  created_at: string;
  updated_at: string;
  vendor?: {
    id: number;
    name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

export interface ProductsResponse {
  products: ProductItem[];
}

export interface ProductResponse {
  product: ProductItem;
  message?: string;
}

export interface UsersResponse {
  users: UserProfile[];
}

export interface UserDetailResponse {
  user: UserProfile;
  message?: string;
}

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const response = await apiClient.get<AdminDashboardResponse>('/admin/dashboard');
  return response.data.stats;
}

export async function fetchVendors(): Promise<UserProfile[]> {
  const response = await apiClient.get<VendorsResponse>('/admin/vendors');
  return response.data.vendors;
}

export async function fetchVendorDetails(id: number): Promise<UserProfile> {
  const response = await apiClient.get<VendorResponse>(`/admin/vendors/${id}`);
  return response.data.vendor;
}

export async function approveVendor(id: number): Promise<UserProfile> {
  const response = await apiClient.post<VendorResponse>(`/admin/vendors/${id}/approve`);
  return response.data.vendor;
}

export async function rejectVendor(id: number): Promise<UserProfile> {
  const response = await apiClient.post<VendorResponse>(`/admin/vendors/${id}/reject`);
  return response.data.vendor;
}

export async function updateVendorStatus(id: number, status: 'active' | 'inactive'): Promise<UserProfile> {
  const response = await apiClient.post<VendorResponse>(`/admin/vendors/${id}/status`, { status });
  return response.data.vendor;
}

// Category API Methods
export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<CategoriesResponse>('/admin/categories');
  return response.data.categories;
}

export async function createCategory(data: { name: string; description?: string; status?: string }): Promise<Category> {
  const response = await apiClient.post<CategoryResponse>('/admin/categories', data);
  return response.data.category;
}

export async function updateCategory(id: number, data: { name: string; description?: string; status?: string }): Promise<Category> {
  const response = await apiClient.put<CategoryResponse>(`/admin/categories/${id}`, data);
  return response.data.category;
}

export async function toggleCategoryStatus(id: number): Promise<Category> {
  const response = await apiClient.post<CategoryResponse>(`/admin/categories/${id}/status`);
  return response.data.category;
}

export async function fetchCategoryRequests(): Promise<CategoryRequestItem[]> {
  const response = await apiClient.get<CategoryRequestsResponse>('/admin/category-requests');
  return response.data.requests;
}

export async function approveCategoryRequest(id: number): Promise<CategoryRequestItem> {
  const response = await apiClient.post<{ request: CategoryRequestItem }>(`/admin/category-requests/${id}/approve`);
  return response.data.request;
}

export async function rejectCategoryRequest(id: number): Promise<CategoryRequestItem> {
  const response = await apiClient.post<{ request: CategoryRequestItem }>(`/admin/category-requests/${id}/reject`);
  return response.data.request;
}

// Product API Methods
export async function fetchProducts(): Promise<ProductItem[]> {
  const response = await apiClient.get<ProductsResponse>('/admin/products');
  return response.data.products;
}

export async function fetchProductDetails(id: number): Promise<ProductItem> {
  const response = await apiClient.get<ProductResponse>(`/admin/products/${id}`);
  return response.data.product;
}

export async function approveProduct(id: number): Promise<ProductItem> {
  const response = await apiClient.post<ProductResponse>(`/admin/products/${id}/approve`);
  return response.data.product;
}

export async function rejectProduct(id: number): Promise<ProductItem> {
  const response = await apiClient.post<ProductResponse>(`/admin/products/${id}/reject`);
  return response.data.product;
}

export async function updateProductStatus(id: number, status: 'active' | 'inactive'): Promise<ProductItem> {
  const response = await apiClient.post<ProductResponse>(`/admin/products/${id}/status`, { status });
  return response.data.product;
}

// User API Methods
export async function fetchUsers(): Promise<UserProfile[]> {
  const response = await apiClient.get<UsersResponse>('/admin/users');
  return response.data.users;
}

export async function fetchUserDetails(id: number): Promise<UserProfile> {
  const response = await apiClient.get<UserDetailResponse>(`/admin/users/${id}`);
  return response.data.user;
}

export async function updateUserStatus(id: number, status: 'active' | 'inactive'): Promise<UserProfile> {
  const response = await apiClient.post<UserDetailResponse>(`/admin/users/${id}/status`, { status });
  return response.data.user;
}
