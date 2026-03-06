export type Role = 'Admin' | 'FrontDesk' | 'User' | 'Employee' | 'Approver' | 'Visitor';

export interface AppUser {
  user_id: string;
  username: string;
  role: Role;
  contact_info: string;
  created_at: string;
  last_login_at: string;
}

export interface Customer {
  customer_id: string;
  name: string;
  logo_url: string;
}

export interface Cabinet {
  cabinet_id: string;
  name: string;
  location: string;
  total_slots: number;
  network_mode: 'local' | 'remote' | 'mixed';
  status: 'online' | 'offline';
  created_at: string;
}

export type SlotStatus = 'free' | 'occupied' | 'locked' | 'fault';

export interface Slot {
  slot_id: string;
  cabinet_id: string;
  slot_number: number;
  assigned_user_id: string | null;
  assigned_username?: string;
  status: SlotStatus;
  last_accessed_at: string;
}

export interface Product {
  product_id: string;
  customer_id: string;
  customer_name?: string;
  customer_logo?: string;
  name: string;
  logo_url: string;
  price: number;
  stock: number;
  status: 'Available' | 'Unavailable';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  username?: string;
  product_id: string;
  product_name?: string;
  assigned_slot_id: string | null;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  payment_info: {
    method: string;
    currency: string;
    amount: number;
    transaction_id?: string;
  };
  created_at: string;
  completed_at: string | null;
}

export interface Approval {
  approval_id: string;
  requester_id: string;
  requester_name?: string;
  slot_id: string;
  slot_number?: number;
  approver_id: string | null;
  approver_name?: string;
  status: 'pending' | 'approved' | 'rejected';
  item_name: string;
  reason: string;
  request_time: string;
  approval_time: string | null;
  notes: string;
}

export interface LogEntry {
  log_id: string;
  user_id: string;
  username?: string;
  slot_id: string | null;
  slot_number?: number;
  action: 'open_lock' | 'close_lock' | 'assign_slot' | 'approval' | 'payment' | 'other';
  timestamp: string;
  device_type: 'Android' | 'Windows';
  notes: string;
}

export type PaymentMethod = 'Alipay' | 'WeChat' | 'PayPal' | 'Stripe' | 'CreditCard';
export type Currency = 'CNY' | 'HKD' | 'USD' | 'EUR';

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  Admin: ['manage_users', 'manage_cabinets', 'manage_approvals', 'view_logs', 'manage_products', 'manage_orders', 'lock_control'],
  FrontDesk: ['assign_slots', 'open_lockers', 'view_logs', 'manage_orders'],
  User: ['purchase_service', 'store_items', 'unlock_slot', 'view_own_logs'],
  Employee: ['request_items', 'view_status', 'view_own_logs'],
  Approver: ['approve_requests', 'reject_requests', 'view_approvals', 'view_logs'],
  Visitor: ['temporary_access'],
};
