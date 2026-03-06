import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { mockApprovals } from '@/data/mock';
import { Approval } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Unlock, History } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalsPage = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('1day');
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  if (!user) return null;

  const isApprover = user.role === 'Approver' || user.role === 'Admin';
  const isEmployee = user.role === 'Employee';

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const historyApprovals = approvals.filter(a => a.status !== 'pending');

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.approval_id === id ? {
      ...a,
      status: 'approved' as const,
      approver_id: user.user_id,
      approver_name: user.username,
      approval_time: new Date().toLocaleString(),
      notes: t('approvals.autoUnlock'),
    } : a));
    toast.success(
      <div className="flex items-center gap-2">
        <Unlock className="w-4 h-4 text-success" />
        <span>{t('approvals.approvedUnlock')}</span>
      </div>
    );
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => a.approval_id === id ? {
      ...a,
      status: 'rejected' as const,
      approver_id: user.user_id,
      approver_name: user.username,
      approval_time: new Date().toLocaleString(),
      notes: rejectNotes[id] || '',
    } : a));
    toast.error(t('approvals.rejected'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    const newApproval: Approval = {
      approval_id: `a${Date.now()}`,
      requester_id: user.user_id,
      requester_name: user.username,
      slot_id: '',
      slot_number: 0,
      approver_id: null,
      approver_name: undefined,
      status: 'pending',
      item_name: itemName,
      reason: `${reason} (${t(`approvals.dur.${duration}`)})`,
      request_time: new Date().toLocaleString(),
      approval_time: null,
      notes: '',
    };
    setApprovals(prev => [newApproval, ...prev]);
    setItemName('');
    setReason('');
    setShowForm(false);
    toast.success(t('approvals.submitted'));
  };

  const statusIcon = (status: string) => {
    if (status === 'pending') return <Clock className="w-5 h-5 text-warning" />;
    if (status === 'approved') return <CheckCircle className="w-5 h-5 text-success" />;
    return <XCircle className="w-5 h-5 text-destructive" />;
  };

  const statusBg = (status: string) => {
    if (status === 'pending') return 'bg-warning/10';
    if (status === 'approved') return 'bg-success/10';
    return 'bg-destructive/10';
  };

  const renderApprovalCard = (a: Approval) => (
    <motion.div
      key={a.approval_id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-4"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${statusBg(a.status)}`}>
          {statusIcon(a.status)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-foreground">{a.item_name}</p>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
              a.status === 'pending' ? 'bg-warning/10 text-warning' :
              a.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>{t(`approvals.status.${a.status}`)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('approvals.by')} <span className="font-medium text-foreground">{a.requester_name}</span> • {a.request_time}
          </p>
          {a.reason && <p className="text-sm text-muted-foreground mt-1">{a.reason}</p>}
          {a.status !== 'pending' && (
            <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
              {a.approver_name && <span>{t('approvals.approver')}: {a.approver_name} • {a.approval_time}</span>}
              {a.notes && <p className="mt-1 italic">{a.notes}</p>}
            </div>
          )}
        </div>
        {isApprover && a.status === 'pending' && (
          <div className="flex flex-col gap-2 shrink-0">
            <Button size="sm" onClick={() => handleApprove(a.approval_id)} className="bg-success hover:bg-success/90 text-success-foreground">
              <CheckCircle className="w-3 h-3 mr-1" />{t('approvals.approve')}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleReject(a.approval_id)}>
              <XCircle className="w-3 h-3 mr-1" />{t('approvals.reject')}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <AppLayout title={t('approvals.title')}>
      {isEmployee && (
        <div className="mb-6">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="gradient-primary">{t('approvals.newRequest')}</Button>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmit}
              className="bg-card rounded-lg border p-5 max-w-lg space-y-4"
            >
              <h3 className="font-semibold text-foreground">{t('approvals.requestAccess')}</h3>
              <Input placeholder={t('approvals.itemName')} value={itemName} onChange={e => setItemName(e.target.value)} />
              <Textarea placeholder={t('approvals.reason')} value={reason} onChange={e => setReason(e.target.value)} rows={3} />
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">{t('approvals.duration')}</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">{t('approvals.dur.1hour')}</SelectItem>
                    <SelectItem value="1day">{t('approvals.dur.1day')}</SelectItem>
                    <SelectItem value="3days">{t('approvals.dur.3days')}</SelectItem>
                    <SelectItem value="1week">{t('approvals.dur.1week')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gradient-primary">{t('approvals.submit')}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('approvals.cancel')}</Button>
              </div>
            </motion.form>
          )}
        </div>
      )}

      {isApprover ? (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="gap-1">
              <Clock className="w-3 h-3" /> {t('approvals.pendingTab')} ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="w-3 h-3" /> {t('approvals.historyTab')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-3">
            {pendingApprovals.length === 0 && (
              <p className="text-muted-foreground text-center py-8">{t('approvals.noPending')}</p>
            )}
            {pendingApprovals.map(renderApprovalCard)}
          </TabsContent>
          <TabsContent value="history" className="space-y-3">
            {historyApprovals.length === 0 && (
              <p className="text-muted-foreground text-center py-8">{t('approvals.noHistory')}</p>
            )}
            {historyApprovals.map(renderApprovalCard)}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-3">
          {approvals
            .filter(a => isEmployee ? a.requester_id === user.user_id : true)
            .map(renderApprovalCard)}
        </div>
      )}
    </AppLayout>
  );
};

export default ApprovalsPage;
