import React, { createContext, useContext, useState, useCallback } from 'react';

export type Lang = 'zh-CN' | 'zh-TW' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  'zh-CN': {
    // Login
    'app.name': '智能柜',
    'app.subtitle': '智能储物柜管理系统',
    'login.username': '用户名',
    'login.password': '密码',
    'login.signin': '登录',
    'login.demo': '演示账户：',
    'login.error': '用户名或密码错误',

    // Sidebar
    'nav.dashboard': '仪表盘',
    'nav.products': '产品管理',
    'nav.orders': '订单管理',
    'nav.approvals': '审批管理',
    'nav.lockers': '柜锁控制',
    'nav.logs': '操作日志',
    'nav.users': '用户管理',
    'nav.signout': '退出登录',
    'nav.prototype': '原型版本',

    // Dashboard
    'dashboard.title': '仪表盘',
    'dashboard.welcome': '欢迎回来，',
    'dashboard.role': '角色',
    'dashboard.lastLogin': '上次登录',
    'dashboard.freeSlots': '空闲柜位',
    'dashboard.occupied': '已占用',
    'dashboard.faults': '故障',
    'dashboard.pendingApprovals': '待审批',
    'dashboard.mySlots': '我的柜位',
    'dashboard.myOrders': '我的订单',
    'dashboard.pending': '待处理',
    'dashboard.myRequests': '我的申请',
    'dashboard.tempAccess': '临时访问',
    'dashboard.tempDesc': '您拥有一次性储物柜访问权限。',
    'dashboard.recentActivity': '最近活动',

    // Products
    'products.title': '产品管理',
    'products.search': '搜索产品...',
    'products.purchase': '购买',
    'products.stock': '库存',

    // Orders
    'orders.title': '订单管理',
    'orders.id': '订单号',
    'orders.user': '用户',
    'orders.product': '产品',
    'orders.amount': '金额',
    'orders.method': '支付方式',
    'orders.slot': '柜位',
    'orders.status': '状态',
    'orders.date': '日期',

    // Approvals
    'approvals.title': '审批管理',
    'approvals.newRequest': '新建申请',
    'approvals.requestAccess': '申请物品取用',
    'approvals.itemName': '物品名称（如：公司印章）',
    'approvals.reason': '申请原因...',
    'approvals.submit': '提交',
    'approvals.cancel': '取消',
    'approvals.approve': '批准',
    'approvals.reject': '驳回',
    'approvals.approved': '已批准',
    'approvals.rejected': '已驳回',
    'approvals.by': '申请人',

    // Lockers
    'lockers.title': '柜锁控制',
    'lockers.openSelected': '开启选中',
    'lockers.readStatus': '读取状态',
    'lockers.openAll': '全部开启',
    'lockers.free': '空闲',
    'lockers.occupied': '占用',
    'lockers.locked': '锁定',
    'lockers.fault': '故障',
    'lockers.protocol': 'RS485 协议帧',
    'lockers.online': '在线',
    'lockers.offline': '离线',
    'lockers.noSelection': '未选择柜位',
    'lockers.opened': '已开启',
    'lockers.allOpened': '全部柜锁已开启',
    'lockers.statusOk': '正在读取柜锁状态…所有板卡响应正常',

    // Logs
    'logs.title': '操作日志',
    'logs.filter': '筛选日志...',
    'logs.allActions': '全部操作',
    'logs.openLock': '开锁',
    'logs.closeLock': '关锁',
    'logs.assignSlot': '分配柜位',
    'logs.approval': '审批',
    'logs.payment': '支付',
    'logs.export': '导出',
    'logs.timestamp': '时间',
    'logs.user': '用户',
    'logs.action': '操作',
    'logs.slot': '柜位',
    'logs.device': '设备',
    'logs.notes': '备注',

    // Users
    'users.title': '用户管理',
    'users.username': '用户名',
    'users.role': '角色',
    'users.contact': '联系方式',
    'users.lastLogin': '上次登录',
    'users.actions': '操作',
    'users.roleUpdated': '角色已更新为',

    // Statuses
    'status.pending': '待处理',
    'status.paid': '已支付',
    'status.completed': '已完成',
    'status.cancelled': '已取消',

    // Language
    'lang.label': '语言',
  },
  'zh-TW': {
    'app.name': '智能櫃',
    'app.subtitle': '智能儲物櫃管理系統',
    'login.username': '使用者名稱',
    'login.password': '密碼',
    'login.signin': '登入',
    'login.demo': '示範帳戶：',
    'login.error': '使用者名稱或密碼錯誤',

    'nav.dashboard': '儀表板',
    'nav.products': '產品管理',
    'nav.orders': '訂單管理',
    'nav.approvals': '審批管理',
    'nav.lockers': '櫃鎖控制',
    'nav.logs': '操作日誌',
    'nav.users': '使用者管理',
    'nav.signout': '登出',
    'nav.prototype': '原型版本',

    'dashboard.title': '儀表板',
    'dashboard.welcome': '歡迎回來，',
    'dashboard.role': '角色',
    'dashboard.lastLogin': '上次登入',
    'dashboard.freeSlots': '空閒櫃位',
    'dashboard.occupied': '已佔用',
    'dashboard.faults': '故障',
    'dashboard.pendingApprovals': '待審批',
    'dashboard.mySlots': '我的櫃位',
    'dashboard.myOrders': '我的訂單',
    'dashboard.pending': '待處理',
    'dashboard.myRequests': '我的申請',
    'dashboard.tempAccess': '臨時訪問',
    'dashboard.tempDesc': '您擁有一次性儲物櫃訪問權限。',
    'dashboard.recentActivity': '最近活動',

    'products.title': '產品管理',
    'products.search': '搜尋產品...',
    'products.purchase': '購買',
    'products.stock': '庫存',

    'orders.title': '訂單管理',
    'orders.id': '訂單號',
    'orders.user': '使用者',
    'orders.product': '產品',
    'orders.amount': '金額',
    'orders.method': '付款方式',
    'orders.slot': '櫃位',
    'orders.status': '狀態',
    'orders.date': '日期',

    'approvals.title': '審批管理',
    'approvals.newRequest': '新建申請',
    'approvals.requestAccess': '申請物品取用',
    'approvals.itemName': '物品名稱（如：公司印章）',
    'approvals.reason': '申請原因...',
    'approvals.submit': '提交',
    'approvals.cancel': '取消',
    'approvals.approve': '批准',
    'approvals.reject': '駁回',
    'approvals.approved': '已批准',
    'approvals.rejected': '已駁回',
    'approvals.by': '申請人',

    'lockers.title': '櫃鎖控制',
    'lockers.openSelected': '開啟選中',
    'lockers.readStatus': '讀取狀態',
    'lockers.openAll': '全部開啟',
    'lockers.free': '空閒',
    'lockers.occupied': '佔用',
    'lockers.locked': '鎖定',
    'lockers.fault': '故障',
    'lockers.protocol': 'RS485 協議幀',
    'lockers.online': '線上',
    'lockers.offline': '離線',
    'lockers.noSelection': '未選擇櫃位',
    'lockers.opened': '已開啟',
    'lockers.allOpened': '全部櫃鎖已開啟',
    'lockers.statusOk': '正在讀取櫃鎖狀態…所有板卡回應正常',

    'logs.title': '操作日誌',
    'logs.filter': '篩選日誌...',
    'logs.allActions': '全部操作',
    'logs.openLock': '開鎖',
    'logs.closeLock': '關鎖',
    'logs.assignSlot': '分配櫃位',
    'logs.approval': '審批',
    'logs.payment': '付款',
    'logs.export': '匯出',
    'logs.timestamp': '時間',
    'logs.user': '使用者',
    'logs.action': '操作',
    'logs.slot': '櫃位',
    'logs.device': '設備',
    'logs.notes': '備註',

    'users.title': '使用者管理',
    'users.username': '使用者名稱',
    'users.role': '角色',
    'users.contact': '聯絡方式',
    'users.lastLogin': '上次登入',
    'users.actions': '操作',
    'users.roleUpdated': '角色已更新為',

    'status.pending': '待處理',
    'status.paid': '已付款',
    'status.completed': '已完成',
    'status.cancelled': '已取消',

    'lang.label': '語言',
  },
  'en': {
    'app.name': 'SmartCabinet',
    'app.subtitle': 'Intelligent Locker Management',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.signin': 'Sign In',
    'login.demo': 'Demo accounts:',
    'login.error': 'Invalid credentials',

    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.orders': 'Orders',
    'nav.approvals': 'Approvals',
    'nav.lockers': 'Locker Control',
    'nav.logs': 'Activity Logs',
    'nav.users': 'User Management',
    'nav.signout': 'Sign Out',
    'nav.prototype': 'v1.0 Prototype',

    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back, ',
    'dashboard.role': 'Role',
    'dashboard.lastLogin': 'Last login',
    'dashboard.freeSlots': 'Free Slots',
    'dashboard.occupied': 'Occupied',
    'dashboard.faults': 'Faults',
    'dashboard.pendingApprovals': 'Pending Approvals',
    'dashboard.mySlots': 'My Slots',
    'dashboard.myOrders': 'My Orders',
    'dashboard.pending': 'Pending',
    'dashboard.myRequests': 'My Requests',
    'dashboard.tempAccess': 'Temporary Access',
    'dashboard.tempDesc': 'You have one-time access to your assigned locker.',
    'dashboard.recentActivity': 'Recent Activity',

    'products.title': 'Products',
    'products.search': 'Search products...',
    'products.purchase': 'Purchase',
    'products.stock': 'Stock',

    'orders.title': 'Orders',
    'orders.id': 'Order ID',
    'orders.user': 'User',
    'orders.product': 'Product',
    'orders.amount': 'Amount',
    'orders.method': 'Method',
    'orders.slot': 'Slot',
    'orders.status': 'Status',
    'orders.date': 'Date',

    'approvals.title': 'Approvals',
    'approvals.newRequest': 'New Request',
    'approvals.requestAccess': 'Request Item Access',
    'approvals.itemName': 'Item name (e.g. Company Seal)',
    'approvals.reason': 'Reason for request...',
    'approvals.submit': 'Submit',
    'approvals.cancel': 'Cancel',
    'approvals.approve': 'Approve',
    'approvals.reject': 'Reject',
    'approvals.approved': 'approved',
    'approvals.rejected': 'rejected',
    'approvals.by': 'By',

    'lockers.title': 'Locker Control',
    'lockers.openSelected': 'Open Selected',
    'lockers.readStatus': 'Read Status',
    'lockers.openAll': 'Open All',
    'lockers.free': 'Free',
    'lockers.occupied': 'Occupied',
    'lockers.locked': 'Locked',
    'lockers.fault': 'Fault',
    'lockers.protocol': 'RS485 Protocol Frame',
    'lockers.online': 'Online',
    'lockers.offline': 'Offline',
    'lockers.noSelection': 'No slots selected',
    'lockers.opened': 'Lock opened',
    'lockers.allOpened': 'All locks opened',
    'lockers.statusOk': 'Reading lock status... All boards responding OK',

    'logs.title': 'Activity Logs',
    'logs.filter': 'Filter logs...',
    'logs.allActions': 'All Actions',
    'logs.openLock': 'Open Lock',
    'logs.closeLock': 'Close Lock',
    'logs.assignSlot': 'Assign Slot',
    'logs.approval': 'Approval',
    'logs.payment': 'Payment',
    'logs.export': 'Export',
    'logs.timestamp': 'Timestamp',
    'logs.user': 'User',
    'logs.action': 'Action',
    'logs.slot': 'Slot',
    'logs.device': 'Device',
    'logs.notes': 'Notes',

    'users.title': 'User Management',
    'users.username': 'Username',
    'users.role': 'Role',
    'users.contact': 'Contact',
    'users.lastLogin': 'Last Login',
    'users.actions': 'Actions',
    'users.roleUpdated': 'Role updated to',

    'status.pending': 'pending',
    'status.paid': 'paid',
    'status.completed': 'completed',
    'status.cancelled': 'cancelled',

    'lang.label': 'Language',
  },
};

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('zh-CN');

  const t = useCallback((key: string): string => {
    return translations[lang][key] || translations['en'][key] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};

export const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
];
