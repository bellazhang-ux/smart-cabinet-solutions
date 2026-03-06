import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { mockSlots, mockOrders, mockApprovals, mockLogs, mockCabinets } from '@/data/mock';
import { Package, ShoppingCart, Lock, AlertTriangle, CheckSquare, ScrollText } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-lg border p-5"
  >
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
  if (!user) return null;

  const freeSlots = mockSlots.filter(s => s.status === 'free').length;
  const occupiedSlots = mockSlots.filter(s => s.status === 'occupied').length;
  const faultSlots = mockSlots.filter(s => s.status === 'fault').length;
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending').length;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;

  const userSlots = mockSlots.filter(s => s.assigned_user_id === user.user_id);
  const userOrders = mockOrders.filter(o => o.user_id === user.user_id);
  const userApprovals = mockApprovals.filter(a => a.requester_id === user.user_id);

  return (
    <AppLayout title="Dashboard">
      <div className="mb-6 p-4 bg-card rounded-lg border">
        <p className="text-foreground">Welcome back, <span className="font-bold font-mono">{user.username}</span></p>
        <p className="text-sm text-muted-foreground">Role: {user.role} • Last login: {user.last_login_at}</p>
      </div>

      {/* Admin / FrontDesk view */}
      {['Admin', 'FrontDesk'].includes(user.role) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Package} label="Free Slots" value={freeSlots} color="bg-success/10 text-success" />
          <StatCard icon={Lock} label="Occupied" value={occupiedSlots} color="bg-primary/10 text-primary" />
          <StatCard icon={AlertTriangle} label="Faults" value={faultSlots} color="bg-destructive/10 text-destructive" />
          <StatCard icon={CheckSquare} label="Pending Approvals" value={pendingApprovals} color="bg-warning/10 text-warning" />
        </div>
      )}

      {/* User view */}
      {user.role === 'User' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatCard icon={Lock} label="My Slots" value={userSlots.length} color="bg-primary/10 text-primary" />
          <StatCard icon={ShoppingCart} label="My Orders" value={userOrders.length} color="bg-success/10 text-success" />
          <StatCard icon={Package} label="Pending" value={userOrders.filter(o => o.status === 'pending').length} color="bg-warning/10 text-warning" />
        </div>
      )}

      {/* Employee view */}
      {user.role === 'Employee' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={CheckSquare} label="My Requests" value={userApprovals.length} color="bg-primary/10 text-primary" />
          <StatCard icon={Lock} label="My Slots" value={userSlots.length} color="bg-success/10 text-success" />
        </div>
      )}

      {/* Approver view */}
      {user.role === 'Approver' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={CheckSquare} label="Pending Approvals" value={pendingApprovals} color="bg-warning/10 text-warning" />
          <StatCard icon={ScrollText} label="Total Logs" value={mockLogs.length} color="bg-primary/10 text-primary" />
        </div>
      )}

      {/* Visitor view */}
      {user.role === 'Visitor' && (
        <div className="p-6 bg-card rounded-lg border text-center">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">Temporary Access</p>
          <p className="text-sm text-muted-foreground">You have one-time access to your assigned locker.</p>
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {mockLogs.slice(0, 5).map(log => (
            <div key={log.log_id} className="px-4 py-3 flex items-center gap-3 text-sm">
              <span className="text-xs text-muted-foreground font-mono w-32 shrink-0">{log.timestamp}</span>
              <span className="font-medium text-foreground">{log.username}</span>
              <span className="text-muted-foreground">{log.notes}</span>
              {log.slot_number && (
                <span className="ml-auto text-xs font-mono bg-muted px-2 py-0.5 rounded">Slot #{String(log.slot_number).padStart(2, '0')}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
