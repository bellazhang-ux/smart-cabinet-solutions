import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useI18n } from '@/contexts/I18nContext';
import { mockProducts } from '@/data/mock';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search } from 'lucide-react';
import PaymentDialog from '@/components/PaymentDialog';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const { t } = useI18n();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  const filtered = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setPayOpen(true);
  };

  return (
    <AppLayout title={t('products.title')}>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t('products.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(product => (
          <div key={product.product_id} className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <Badge variant={product.status === 'Available' ? 'default' : 'secondary'}>{product.status}</Badge>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{product.customer_name}</p>
            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-foreground">${product.price}</span>
              <span className="text-xs text-muted-foreground">{t('products.stock')}: {product.stock}</span>
            </div>
            <Button className="w-full mt-4 gradient-primary" size="sm" onClick={() => handlePurchase(product)}>{t('products.purchase')}</Button>
          </div>
        ))}
      </div>
      <PaymentDialog product={selectedProduct} open={payOpen} onOpenChange={setPayOpen} />
    </AppLayout>
  );
};

export default ProductsPage;
