import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product, PaymentMethod, Currency } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; region: string }[] = [
  { value: 'Alipay', label: '支付宝 / Alipay', region: 'CN' },
  { value: 'WeChat', label: '微信支付 / WeChat Pay', region: 'CN' },
  { value: 'PayPal', label: 'PayPal', region: 'INT' },
  { value: 'Stripe', label: 'Stripe', region: 'INT' },
  { value: 'CreditCard', label: 'Credit Card', region: 'INT' },
];

const CURRENCIES: { value: Currency; symbol: string }[] = [
  { value: 'CNY', symbol: '¥' },
  { value: 'HKD', symbol: 'HK$' },
  { value: 'USD', symbol: '$' },
  { value: 'EUR', symbol: '€' },
];

type PayStep = 'select' | 'processing' | 'success' | 'failed';

interface PaymentDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (orderId: string, slotId: string) => void;
}

const PaymentDialog = ({ product, open, onOpenChange, onSuccess }: PaymentDialogProps) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [method, setMethod] = useState<PaymentMethod>('Alipay');
  const [currency, setCurrency] = useState<Currency>('CNY');
  const [step, setStep] = useState<PayStep>('select');
  const [txId, setTxId] = useState('');
  const [assignedSlot, setAssignedSlot] = useState('');

  const currencySymbol = CURRENCIES.find(c => c.value === currency)?.symbol || '$';
  const convertedAmount = product ? (currency === 'CNY' ? product.price * 7.2 : currency === 'HKD' ? product.price * 7.8 : currency === 'EUR' ? product.price * 0.92 : product.price).toFixed(2) : '0';

  const handlePay = () => {
    setStep('processing');
    // Simulate payment API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        const newTxId = `TX${Date.now().toString(36).toUpperCase()}`;
        const slotNum = Math.floor(Math.random() * 12) + 1;
        const slotId = `s${slotNum}`;
        setTxId(newTxId);
        setAssignedSlot(`#${String(slotNum).padStart(2, '0')}`);
        setStep('success');
        toast.success(t('pay.success'));
        onSuccess?.(newTxId, slotId);
      } else {
        setStep('failed');
        toast.error(t('pay.failed'));
      }
    }, 2000);
  };

  const handleRetry = () => setStep('select');

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setStep('select'); setTxId(''); setAssignedSlot(''); }, 300);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {t('pay.title')}
          </DialogTitle>
          <DialogDescription>{product.name} — {product.customer_name}</DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4 pt-2">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('pay.total')}</p>
              <p className="text-3xl font-bold font-mono text-foreground">{currencySymbol}{convertedAmount}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('pay.currency')}</label>
              <Select value={currency} onValueChange={v => setCurrency(v as Currency)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.value} ({c.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('pay.method')}</label>
              <Select value={method} onValueChange={v => setMethod(v as PaymentMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePay} className="w-full gradient-primary">{t('pay.confirm')}</Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
            <p className="text-foreground font-medium">{t('pay.processing')}</p>
            <p className="text-sm text-muted-foreground">{method} • {currencySymbol}{convertedAmount}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-success" />
            <div>
              <p className="text-lg font-bold text-foreground">{t('pay.success')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('pay.txId')}: {txId}</p>
              <p className="text-sm font-mono text-primary mt-1">{t('pay.assignedSlot')}: {assignedSlot}</p>
            </div>
            <Button onClick={handleClose} variant="outline" className="w-full">{t('pay.close')}</Button>
          </div>
        )}

        {step === 'failed' && (
          <div className="py-8 text-center space-y-4">
            <XCircle className="w-16 h-16 mx-auto text-destructive" />
            <div>
              <p className="text-lg font-bold text-foreground">{t('pay.failed')}</p>
              <p className="text-sm text-muted-foreground">{t('pay.retryHint')}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRetry} className="flex-1 gradient-primary">{t('pay.retry')}</Button>
              <Button onClick={handleClose} variant="outline" className="flex-1">{t('pay.close')}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
