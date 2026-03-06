import AppLayout from '@/components/AppLayout';
import { mockOrders } from '@/data/mock';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/30',
  paid: 'bg-success/10 text-success border-success/30',
  completed: 'bg-primary/10 text-primary border-primary/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
};

const OrdersPage = () => {
  return (
    <AppLayout title="Orders">
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Method</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Slot</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockOrders.map(order => (
              <tr key={order.order_id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{order.order_id}</td>
                <td className="px-4 py-3">{order.username}</td>
                <td className="px-4 py-3">{order.product_name}</td>
                <td className="px-4 py-3 font-mono">{order.payment_info.currency} {order.payment_info.amount}</td>
                <td className="px-4 py-3">{order.payment_info.method}</td>
                <td className="px-4 py-3 font-mono">{order.assigned_slot_id || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{order.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default OrdersPage;
