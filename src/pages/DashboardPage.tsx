import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { mockSlots, mockOrders, mockApprovals, mockLogs, mockProducts } from '@/data/mock';
import { Product } from '@/types';
import { Package, ShoppingCart, Lock, AlertTriangle, CheckSquare, ScrollText, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentDialog from '@/components/PaymentDialog';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg border p-5">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  if (!user) return null;

  const freeSlots = mockSlots.filter(s => s.status === 'free').length;
  const occupiedSlots = mockSlots.filter(s => s.status === 'occupied').length;
  const faultSlots = mockSlots.filter(s => s.status === 'fault').length;
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length;
  const userSlots = mockSlots.filter(s => s.assigned_user_id === user.user_id);
  const userOrders = mockOrders.filter(o => o.user_id === user.user_id);
  const userApprovals = mockApprovals.filter(a => a.requester_id === user.user_id);

  return (
    <AppLayout title={t('dashboard.title')}>
      <div className="mb-6 p-4 bg-card rounded-lg border">
        <p className="text-foreground">{t('dashboard.welcome')}<span className="font-bold font-mono">{user.username}</span></p>
        <p className="text-sm text-muted-foreground">{t('dashboard.role')}: {user.role} • {t('dashboard.lastLogin')}: {user.last_login_at}</p>
      </div>

      {/* Admin / FrontDesk overview */}
      {['Admin', 'FrontDesk'].includes(user.role) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Package} label={t('dashboard.freeSlots')} value={freeSlots} color="bg-success/10 text-success" />
          <StatCard icon={Lock} label={t('dashboard.occupied')} value={occupiedSlots} color="bg-primary/10 text-primary" />
          <StatCard icon={AlertTriangle} label={t('dashboard.faults')} value={faultSlots} color="bg-destructive/10 text-destructive" />
          <StatCard icon={CheckSquare} label={t('dashboard.pendingApprovals')} value={pendingApprovals} color="bg-warning/10 text-warning" />
        </div>
      )}

      {/* User Home View */}
      {user.role === 'User' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatCard icon={Lock} label={t('dashboard.mySlots')} value={userSlots.length} color="bg-primary/10 text-primary" />
            <StatCard icon={ShoppingCart} label={t('dashboard.myOrders')} value={userOrders.length} color="bg-success/10 text-success" />
            <StatCard icon={Package} label={t('dashboard.pending')} value={userOrders.filter(o => o.status === 'pending').length} color="bg-warning/10 text-warning" />
          </div>

          {/* My Assigned Slots */}
          {userSlots.length > 0 && (
            <div className="bg-card rounded-lg border mb-6">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> {t('dashboard.assignedSlots')}
                </h2>
              </div>
              <div className="p-4 grid gap-3 sm:grid-cols-2">
                {userSlots.map(slot => (
                  <div key={slot.slot_id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-bold text-primary">
                      #{String(slot.slot_number).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Slot #{String(slot.slot_number).padStart(2, '0')}</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.lastAccess')}: {slot.last_accessed_at}</p>
                    </div>
                    <Badge variant={slot.status === 'occupied' ? 'default' : 'secondary'}>
                      {slot.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Purchase */}
          <div className="bg-card rounded-lg border mb-6">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{t('dashboard.quickPurchase')}</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>{t('dashboard.viewAll')}</Button>
            </div>
            <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mockProducts.filter(p => p.status === 'Available').slice(0, 3).map(product => (
                <div key={product.product_id} className="p-3 rounded-lg bg-muted/30 border">
                  <p className="font-medium text-sm text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{product.customer_name}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-foreground">${product.price}</span>
                    <Button size="sm" className="gradient-primary h-7 text-xs" onClick={() => { setSelectedProduct(product); setPayOpen(true); }}>
                      {t('products.purchase')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Logs */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-foreground">{t('dashboard.myLogs')}</h2>
            </div>
            <div className="divide-y">
              {mockLogs.filter(l => l.user_id === user.user_id).slice(0, 5).map(log => (
                <div key={log.log_id} className="px-4 py-3 flex items-center gap-3 text-sm">
                  <span className="text-xs text-muted-foreground font-mono w-32 shrink-0">{log.timestamp}</span>
                  <span className="text-muted-foreground">{log.notes}</span>
                  {log.slot_number && <span className="ml-auto text-xs font-mono bg-muted px-2 py-0.5 rounded">Slot #{String(log.slot_number).padStart(2, '0')}</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {user.role === 'Employee' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={CheckSquare} label={t('dashboard.myRequests')} value={userApprovals.length} color="bg-primary/10 text-primary" />
          <StatCard icon={Lock} label={t('dashboard.mySlots')} value={userSlots.length} color="bg-success/10 text-success" />
        </div>
      )}

      {user.role === 'Approver' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={CheckSquare} label={t('dashboard.pendingApprovals')} value={pendingApprovals} color="bg-warning/10 text-warning" />
          <StatCard icon={ScrollText} label={t('logs.title')} value={mockLogs.length} color="bg-primary/10 text-primary" />
        </div>
      )}

      {user.role === 'Visitor' && (
        <div className="p-6 bg-card rounded-lg border text-center">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">{t('dashboard.tempAccess')}</p>
          <p className="text-sm text-muted-foreground">{t('dashboard.tempDesc')}</p>
        </div>
      )}

      {/* Recent Activity for non-User roles */}
      {user.role !== 'User' && (
        <div className="bg-card rounded-lg border mt-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">{t('dashboard.recentActivity')}</h2>
          </div>
          <div className="divide-y">
            {mockLogs.slice(0, 5).map(log => (
              <div key={log.log_id} className="px-4 py-3 flex items-center gap-3 text-sm">
                <span className="text-xs text-muted-foreground font-mono w-32 shrink-0">{log.timestamp}</span>
                <span className="font-medium text-foreground">{log.username}</span>
                <span className="text-muted-foreground">{log.notes}</span>
                {log.slot_number && <span className="ml-auto text-xs font-mono bg-muted px-2 py-0.5 rounded">Slot #{String(log.slot_number).padStart(2, '0')}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <PaymentDialog product={selectedProduct} open={payOpen} onOpenChange={setPayOpen} />
    </AppLayout>
  );
};

export default DashboardPage;
