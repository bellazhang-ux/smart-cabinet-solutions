import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, CheckSquare, Lock, ScrollText, Users, LogOut,
} from 'lucide-react';
import { ROLE_PERMISSIONS } from '@/types';
import LangSwitcher from '@/components/LangSwitcher';

const navItems = [
  { path: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, permission: null },
  { path: '/products', labelKey: 'nav.products', icon: Package, permission: 'manage_products' },
  { path: '/orders', labelKey: 'nav.orders', icon: ShoppingCart, permission: 'purchase_service' },
  { path: '/approvals', labelKey: 'nav.approvals', icon: CheckSquare, permission: 'approve_requests' },
  { path: '/lockers', labelKey: 'nav.lockers', icon: Lock, permission: 'lock_control' },
  { path: '/logs', labelKey: 'nav.logs', icon: ScrollText, permission: 'view_logs' },
  { path: '/users', labelKey: 'nav.users', icon: Users, permission: 'manage_users' },
];

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  const visibleItems = navItems.filter(item => {
    if (!item.permission) return true;
    if (item.path === '/orders' && ['User', 'FrontDesk', 'Admin'].includes(user.role)) return true;
    if (item.path === '/approvals' && user.role === 'Employee') return true;
    if (item.path === '/lockers' && ['FrontDesk', 'Admin'].includes(user.role)) return true;
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
            <h2 className="text-sm font-bold text-sidebar-foreground font-mono">{t('app.name')}</h2>
            <p className="text-xs text-sidebar-foreground/60">{t('nav.prototype')}</p>
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
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <LangSwitcher />
        </div>
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
          {t('nav.signout')}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
