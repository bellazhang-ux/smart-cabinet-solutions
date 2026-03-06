import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useI18n } from '@/contexts/I18nContext';
import { mockLogs } from '@/data/mock';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download } from 'lucide-react';

const actionColors: Record<string, string> = {
  open_lock: 'bg-success/10 text-success',
  close_lock: 'bg-warning/10 text-warning',
  assign_slot: 'bg-primary/10 text-primary',
  approval: 'bg-accent/10 text-accent',
  payment: 'bg-success/10 text-success',
  other: 'bg-muted text-muted-foreground',
};

const LogsPage = () => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = mockLogs.filter(l => {
    const matchSearch = !search || l.username?.toLowerCase().includes(search.toLowerCase()) || l.notes.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const actionLabelMap: Record<string, string> = {
    open_lock: t('logs.openLock'),
    close_lock: t('logs.closeLock'),
    assign_slot: t('logs.assignSlot'),
    approval: t('logs.approval'),
    payment: t('logs.payment'),
  };

  return (
    <AppLayout title={t('logs.title')}>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t('logs.filter')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder={t('logs.allActions')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('logs.allActions')}</SelectItem>
            <SelectItem value="open_lock">{t('logs.openLock')}</SelectItem>
            <SelectItem value="close_lock">{t('logs.closeLock')}</SelectItem>
            <SelectItem value="assign_slot">{t('logs.assignSlot')}</SelectItem>
            <SelectItem value="approval">{t('logs.approval')}</SelectItem>
            <SelectItem value="payment">{t('logs.payment')}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />{t('logs.export')}</Button>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('logs.timestamp')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('logs.user')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('logs.action')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('logs.slot')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('logs.device')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('logs.notes')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(log => (
              <tr key={log.log_id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{log.timestamp}</td>
                <td className="px-4 py-3 font-medium">{log.username}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${actionColors[log.action]}`}>
                    {actionLabelMap[log.action] || log.action}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">{log.slot_number ? `#${String(log.slot_number).padStart(2, '0')}` : '—'}</td>
                <td className="px-4 py-3 text-xs">{log.device_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default LogsPage;
