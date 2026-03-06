import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useI18n } from '@/contexts/I18nContext';
import { mockSlots, mockCabinets } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Unlock, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { SlotStatus } from '@/types';

const LockersPage = () => {
  const { t } = useI18n();
  const [selectedCabinet, setSelectedCabinet] = useState(mockCabinets[0].cabinet_id);
  const [slots, setSlots] = useState(mockSlots);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const cabinet = mockCabinets.find(c => c.cabinet_id === selectedCabinet)!;
  const cabinetSlots = slots.filter(s => s.cabinet_id === selectedCabinet);

  const statusIcon: Record<SlotStatus, React.ReactNode> = {
    free: <Unlock className="w-5 h-5" />,
    occupied: <Lock className="w-5 h-5" />,
    locked: <Lock className="w-5 h-5" />,
    fault: <AlertTriangle className="w-5 h-5" />,
  };

  const statusLabel: Record<SlotStatus, string> = {
    free: t('lockers.free'),
    occupied: t('lockers.occupied'),
    locked: t('lockers.locked'),
    fault: t('lockers.fault'),
  };

  const toggleSelect = (slotId: string) => {
    setSelectedSlots(prev => {
      const next = new Set(prev);
      next.has(slotId) ? next.delete(slotId) : next.add(slotId);
      return next;
    });
  };

  const openSelected = () => {
    if (selectedSlots.size === 0) { toast.error(t('lockers.noSelection')); return; }
    setSlots(prev => prev.map(s =>
      selectedSlots.has(s.slot_id) ? { ...s, status: 'free' as SlotStatus } : s
    ));
    toast.success(`RS485 → ${t('lockers.opened')} (${selectedSlots.size})`);
    setSelectedSlots(new Set());
  };

  const openSingle = (slotId: string) => {
    setSlots(prev => prev.map(s =>
      s.slot_id === slotId ? { ...s, status: 'free' as SlotStatus } : s
    ));
    toast.success(`RS485 → ${t('lockers.opened')}`);
  };

  return (
    <AppLayout title={t('lockers.title')}>
      <div className="flex items-center gap-4 mb-6">
        <Select value={selectedCabinet} onValueChange={setSelectedCabinet}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            {mockCabinets.map(c => (
              <SelectItem key={c.cabinet_id} value={c.cabinet_id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-sm">
          {cabinet.status === 'online' ? (
            <><Wifi className="w-4 h-4 text-success" /><span className="text-success">{t('lockers.online')}</span></>
          ) : (
            <><WifiOff className="w-4 h-4 text-destructive" /><span className="text-destructive">{t('lockers.offline')}</span></>
          )}
          <span className="text-muted-foreground">• {cabinet.location} • {cabinet.network_mode}</span>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button onClick={openSelected} className="gradient-primary">{t('lockers.openSelected')}</Button>
        <Button variant="outline" onClick={() => toast.info(`RS485 → ${t('lockers.statusOk')}`)}>{t('lockers.readStatus')}</Button>
        <Button variant="outline" onClick={() => {
          setSlots(prev => prev.map(s => s.cabinet_id === selectedCabinet ? { ...s, status: 'free' } : s));
          toast.success(`RS485 → ${t('lockers.allOpened')}`);
        }}>{t('lockers.openAll')}</Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {cabinetSlots.map(slot => (
          <button
            key={slot.slot_id}
            onClick={() => toggleSelect(slot.slot_id)}
            onDoubleClick={() => openSingle(slot.slot_id)}
            className={`relative p-4 rounded-lg border-2 transition-all text-center ${
              selectedSlots.has(slot.slot_id) ? 'ring-2 ring-primary ring-offset-2' : ''
            } ${
              slot.status === 'free' ? 'slot-free' :
              slot.status === 'occupied' ? 'slot-occupied' :
              slot.status === 'locked' ? 'slot-locked' :
              'slot-fault animate-pulse-slot'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              {statusIcon[slot.status]}
              <span className="font-mono text-sm font-bold">#{String(slot.slot_number).padStart(2, '0')}</span>
              <span className="text-[10px]">{statusLabel[slot.status]}</span>
              {slot.assigned_username && <span className="text-[10px] font-medium">{slot.assigned_username}</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-card rounded-lg border">
        <h3 className="font-semibold text-foreground mb-2 font-mono text-sm">{t('lockers.protocol')}</h3>
        <pre className="text-xs font-mono text-muted-foreground bg-muted p-3 rounded overflow-x-auto">
{`┌──────┬──────────┬─────────┬──────┬──────────┐
│ HEAD │ BOARD_ID │ COMMAND │ DATA │ CHECKSUM │
│ 0xAA │  0x01    │  0x11   │ 0x03 │   XOR    │
└──────┴──────────┴─────────┴──────┴──────────┘
Commands: 0x11=Open Single  0x12=Open Multi  0x13=Open All
          0x21=Read Status  0x31=Delayed Open`}
        </pre>
      </div>
    </AppLayout>
  );
};

export default LockersPage;
