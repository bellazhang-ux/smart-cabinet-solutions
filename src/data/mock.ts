import { AppUser, Customer, Cabinet, Slot, Product, Order, Approval, LogEntry } from '@/types';

export const mockUsers: AppUser[] = [
  { user_id: 'u1', username: 'admin', role: 'Admin', contact_info: 'admin@acme.com', created_at: '2025-01-01', last_login_at: '2026-03-06' },
  { user_id: 'u2', username: 'frontdesk', role: 'FrontDesk', contact_info: 'desk@acme.com', created_at: '2025-02-01', last_login_at: '2026-03-06' },
  { user_id: 'u3', username: 'alice', role: 'User', contact_info: 'alice@mail.com', created_at: '2025-03-01', last_login_at: '2026-03-05' },
  { user_id: 'u4', username: 'bob', role: 'User', contact_info: 'bob@mail.com', created_at: '2025-03-10', last_login_at: '2026-03-04' },
  { user_id: 'u5', username: 'john', role: 'Employee', contact_info: 'john@acme.com', created_at: '2025-04-01', last_login_at: '2026-03-06' },
  { user_id: 'u6', username: 'manager', role: 'Approver', contact_info: 'mgr@acme.com', created_at: '2025-01-15', last_login_at: '2026-03-06' },
  { user_id: 'u7', username: 'visitor01', role: 'Visitor', contact_info: 'visitor@temp.com', created_at: '2026-03-06', last_login_at: '2026-03-06' },
];

export const mockCustomers: Customer[] = [
  { customer_id: 'c1', name: 'ACME Corp', logo_url: '' },
  { customer_id: 'c2', name: 'TechVault Inc', logo_url: '' },
];

export const mockCabinets: Cabinet[] = [
  { cabinet_id: 'cab1', name: 'Cabinet A-01', location: 'Floor 1, Lobby', total_slots: 12, network_mode: 'local', status: 'online', created_at: '2025-01-01' },
  { cabinet_id: 'cab2', name: 'Cabinet B-02', location: 'Floor 2, Office', total_slots: 8, network_mode: 'remote', status: 'online', created_at: '2025-02-01' },
];

export const mockSlots: Slot[] = [
  { slot_id: 's1', cabinet_id: 'cab1', slot_number: 1, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's2', cabinet_id: 'cab1', slot_number: 2, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's3', cabinet_id: 'cab1', slot_number: 3, assigned_user_id: 'u4', assigned_username: 'bob', status: 'occupied', last_accessed_at: '2026-03-06 09:15' },
  { slot_id: 's4', cabinet_id: 'cab1', slot_number: 4, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 07:00' },
  { slot_id: 's5', cabinet_id: 'cab1', slot_number: 5, assigned_user_id: 'u3', assigned_username: 'alice', status: 'occupied', last_accessed_at: '2026-03-06 10:30' },
  { slot_id: 's6', cabinet_id: 'cab1', slot_number: 6, assigned_user_id: null, status: 'locked', last_accessed_at: '2026-03-05 18:00' },
  { slot_id: 's7', cabinet_id: 'cab1', slot_number: 7, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 06:00' },
  { slot_id: 's8', cabinet_id: 'cab1', slot_number: 8, assigned_user_id: null, status: 'fault', last_accessed_at: '2026-03-04 12:00' },
  { slot_id: 's9', cabinet_id: 'cab1', slot_number: 9, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's10', cabinet_id: 'cab1', slot_number: 10, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's11', cabinet_id: 'cab1', slot_number: 11, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's12', cabinet_id: 'cab1', slot_number: 12, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's13', cabinet_id: 'cab2', slot_number: 1, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's14', cabinet_id: 'cab2', slot_number: 2, assigned_user_id: 'u5', assigned_username: 'john', status: 'locked', last_accessed_at: '2026-03-06 11:00' },
  { slot_id: 's15', cabinet_id: 'cab2', slot_number: 3, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's16', cabinet_id: 'cab2', slot_number: 4, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's17', cabinet_id: 'cab2', slot_number: 5, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's18', cabinet_id: 'cab2', slot_number: 6, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's19', cabinet_id: 'cab2', slot_number: 7, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
  { slot_id: 's20', cabinet_id: 'cab2', slot_number: 8, assigned_user_id: null, status: 'free', last_accessed_at: '2026-03-06 08:00' },
];

export const mockProducts: Product[] = [
  { product_id: 'p1', customer_id: 'c1', customer_name: 'ACME Corp', name: 'Standard Storage (1 Month)', logo_url: '', price: 29.99, stock: 50, status: 'Available', description: 'One month locker rental with 24/7 access', created_at: '2025-01-01', updated_at: '2026-03-01' },
  { product_id: 'p2', customer_id: 'c1', customer_name: 'ACME Corp', name: 'Premium Storage (3 Months)', logo_url: '', price: 79.99, stock: 25, status: 'Available', description: 'Three month locker rental with priority support', created_at: '2025-01-01', updated_at: '2026-03-01' },
  { product_id: 'p3', customer_id: 'c2', customer_name: 'TechVault Inc', name: 'USB Lock Board', logo_url: '', price: 10.00, stock: 100, status: 'Available', description: 'RS485 USB lock control board', created_at: '2025-06-01', updated_at: '2026-02-15' },
];

export const mockOrders: Order[] = [
  { order_id: 'o1', user_id: 'u3', username: 'alice', product_id: 'p1', product_name: 'Standard Storage', assigned_slot_id: 's5', status: 'paid', payment_info: { method: 'Alipay', currency: 'CNY', amount: 29.99, transaction_id: 'TX001' }, created_at: '2026-03-01', completed_at: null },
  { order_id: 'o2', user_id: 'u4', username: 'bob', product_id: 'p2', product_name: 'Premium Storage', assigned_slot_id: 's3', status: 'paid', payment_info: { method: 'PayPal', currency: 'USD', amount: 79.99, transaction_id: 'TX002' }, created_at: '2026-03-02', completed_at: null },
  { order_id: 'o3', user_id: 'u3', username: 'alice', product_id: 'p3', product_name: 'USB Lock Board', assigned_slot_id: null, status: 'pending', payment_info: { method: 'CreditCard', currency: 'USD', amount: 10.00 }, created_at: '2026-03-06', completed_at: null },
];

export const mockApprovals: Approval[] = [
  { approval_id: 'a1', requester_id: 'u5', requester_name: 'john', slot_id: 's14', slot_number: 2, approver_id: null, status: 'pending', item_name: 'Company Seal', reason: 'Client contract signing', request_time: '2026-03-06 09:00', approval_time: null, notes: '' },
  { approval_id: 'a2', requester_id: 'u5', requester_name: 'john', slot_id: 's1', slot_number: 1, approver_id: 'u6', approver_name: 'manager', status: 'approved', item_name: 'Access Badge', reason: 'Office entry needed', request_time: '2026-03-05 14:00', approval_time: '2026-03-05 15:30', notes: 'Approved for 1 day' },
];

export const mockLogs: LogEntry[] = [
  { log_id: 'l1', user_id: 'u3', username: 'alice', slot_id: 's5', slot_number: 5, action: 'assign_slot', timestamp: '2026-03-06 09:20', device_type: 'Android', notes: 'Stored personal items' },
  { log_id: 'l2', user_id: 'u1', username: 'admin', slot_id: null, action: 'approval', timestamp: '2026-03-06 10:05', device_type: 'Windows', notes: 'Approved John request' },
  { log_id: 'l3', user_id: 'u4', username: 'bob', slot_id: 's3', slot_number: 3, action: 'open_lock', timestamp: '2026-03-06 09:15', device_type: 'Android', notes: 'Opened slot #03' },
  { log_id: 'l4', user_id: 'u2', username: 'frontdesk', slot_id: 's6', slot_number: 6, action: 'close_lock', timestamp: '2026-03-05 18:00', device_type: 'Windows', notes: 'Locked slot #06 end of day' },
  { log_id: 'l5', user_id: 'u3', username: 'alice', slot_id: null, action: 'payment', timestamp: '2026-03-06 09:10', device_type: 'Android', notes: 'Paid ¥29.99 via Alipay' },
];

export const LOGIN_CREDENTIALS: Record<string, { password: string; role: string }> = {
  admin: { password: 'admin', role: 'Admin' },
  frontdesk: { password: 'desk', role: 'FrontDesk' },
  alice: { password: 'alice', role: 'User' },
  bob: { password: 'bob', role: 'User' },
  john: { password: 'john', role: 'Employee' },
  manager: { password: 'manager', role: 'Approver' },
  visitor01: { password: 'visit', role: 'Visitor' },
};
