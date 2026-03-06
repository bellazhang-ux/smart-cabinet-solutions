import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, CheckSquare, Lock, ScrollText, Users, LogOut, Settings
} from 'lucide-react';
import { ROLE_PERMISSIONS } from '@/types';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { path: '/products', label: 'Products', icon: Package, permission: 'manage_products' },
  { path: '/orders', label: 'Orders', icon: ShoppingCart, permission: 'purchase_service' },
  { path: '/approvals', label: 'Approvals', icon: CheckSquare, permission: 'approve_requests' },
  { path: '/lockers', label: 'Locker Control', icon: Lock, permission: 'lock_control' },
  { path: '/logs', label: 'Activity Logs', icon: ScrollText, permission: 'view_logs' },
  { path: '/users', label: 'User Management', icon: Users, permission: 'manage_users' },
];

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const visibleItems = navItems.filter(item => {
    if (!item.permission) return true;
    // Show orders for Users and FrontDesk
    if (item.path === '/orders' && ['User', 'FrontDesk', 'Admin'].includes(user.role)) return true;
    // Show approvals for Employee too (to submit requests)
    if (item.path === '/approvals' && user.role === 'Employee') return true;
    // Show lockers for FrontDesk
    if (item.path === '/lockers' && ['FrontDesk', 'Admin'].includes(user.role)) return true;
    // Show logs for FrontDesk
    if (item.path === '/logs' && ['FrontDesk', 'Admin', 'Approver'].includes(user.role)) return true;
    return permissions.includes(item.permission);
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-60 min-h-screen gradient-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sidebar-foreground font-mono">SmartCabinet</h2>
            <p className="text-xs text-sidebar-foreground/60">v1.0 Prototype</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-mono text-sidebar-foreground">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.username}</p>
            <p className="text-xs text-sidebar-foreground/60">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
