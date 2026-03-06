import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { mockApprovals } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ApprovalsPage = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [approvals, setApprovals] = useState(mockApprovals);
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [reason, setReason] = useState('');

  if (!user) return null;

  const isApprover = user.role === 'Approver' || user.role === 'Admin';
  const isEmployee = user.role === 'Employee';

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.approval_id === id ? { ...a, status: 'approved' as const, approver_id: user.user_id, approver_name: user.username, approval_time: new Date().toISOString() } : a));
    toast.success(t('approvals.approved'));
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => a.approval_id === id ? { ...a, status: 'rejected' as const, approver_id: user.user_id, approver_name: user.username, approval_time: new Date().toISOString() } : a));
    toast.error(t('approvals.rejected'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    const newApproval = {
      approval_id: `a${Date.now()}`,
      requester_id: user.user_id,
      requester_name: user.username,
      slot_id: '',
      slot_number: 0,
      approver_id: null,
      approver_name: undefined,
      status: 'pending' as const,
      item_name: itemName,
      reason,
      request_time: new Date().toISOString(),
      approval_time: null,
      notes: '',
    };
    setApprovals(prev => [newApproval, ...prev]);
    setItemName('');
    setReason('');
    setShowForm(false);
    toast.success(t('approvals.submit'));
  };

  return (
    <AppLayout title={t('approvals.title')}>
      {isEmployee && (
        <div className="mb-6">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="gradient-primary">{t('approvals.newRequest')}</Button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-5 max-w-md space-y-4">
              <h3 className="font-semibold text-foreground">{t('approvals.requestAccess')}</h3>
              <Input placeholder={t('approvals.itemName')} value={itemName} onChange={e => setItemName(e.target.value)} />
              <Textarea placeholder={t('approvals.reason')} value={reason} onChange={e => setReason(e.target.value)} />
              <div className="flex gap-2">
                <Button type="submit" className="gradient-primary">{t('approvals.submit')}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('approvals.cancel')}</Button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="space-y-3">
        {approvals.map(a => (
          <div key={a.approval_id} className="bg-card rounded-lg border p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              a.status === 'pending' ? 'bg-warning/10' : a.status === 'approved' ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {a.status === 'pending' ? <Clock className="w-5 h-5 text-warning" /> :
               a.status === 'approved' ? <CheckCircle className="w-5 h-5 text-success" /> :
               <XCircle className="w-5 h-5 text-destructive" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{a.item_name}</p>
              <p className="text-xs text-muted-foreground">
                {t('approvals.by')} {a.requester_name} • {a.request_time}
                {a.reason && ` • ${a.reason}`}
              </p>
            </div>
            <span className={`text-xs font-mono px-2 py-1 rounded ${
              a.status === 'pending' ? 'bg-warning/10 text-warning' :
              a.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>
              {t(`status.${a.status === 'approved' ? 'completed' : a.status === 'rejected' ? 'cancelled' : 'pending'}`)}
            </span>
            {isApprover && a.status === 'pending' && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(a.approval_id)} className="bg-success hover:bg-success/90 text-success-foreground">{t('approvals.approve')}</Button>
                <Button size="sm" variant="destructive" onClick={() => handleReject(a.approval_id)}>{t('approvals.reject')}</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default ApprovalsPage;
