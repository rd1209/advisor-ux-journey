
import React from 'react';
import { Product } from '@/lib/types';
import { CreditCard, BanknoteIcon, Shield, PiggyBank, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  recommended?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, recommended = false, className }) => {
  const getProductIcon = (type: Product['type']) => {
    switch (type) {
      case 'creditCard':
        return <CreditCard className="text-blue-500" />;
      case 'loan':
        return <BanknoteIcon className="text-green-500" />;
      case 'insurance':
        return <Shield className="text-purple-500" />;
      case 'savings':
        return <PiggyBank className="text-amber-500" />;
    }
  };

  const getTypeLabel = (type: Product['type']) => {
    switch (type) {
      case 'creditCard':
        return 'Tarjeta de crédito';
      case 'loan':
        return 'Préstamo';
      case 'insurance':
        return 'Seguro';
      case 'savings':
        return 'Cuenta de ahorro';
    }
  };

  return (
    <div className={cn(
      'glass-card rounded-xl p-4 transition-all duration-300 hover:shadow-md',
      recommended && 'card-highlight',
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {getProductIcon(product.type)}
          <div>
            <div className="text-xs text-muted-foreground">
              {getTypeLabel(product.type)}
            </div>
            <h3 className="font-medium">{product.name}</h3>
          </div>
        </div>
        {recommended && (
          <span className="badge badge-success flex items-center gap-1">
            <Check size={12} />
            Recomendado
          </span>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
      
      <div className="mt-3">
        <div className="text-sm font-medium mb-1 flex items-center gap-1">
          <Check size={14} className="text-primary" />
          <span>Beneficios principales</span>
        </div>
        <ul className="text-sm space-y-1.5">
          {product.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {product.interestRate && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="p-2 bg-secondary/40 rounded-md">
            <div className="text-xs text-muted-foreground">Tasa mínima</div>
            <div className="font-medium">{product.interestRate.min}%</div>
          </div>
          <div className="p-2 bg-secondary/40 rounded-md">
            <div className="text-xs text-muted-foreground">Tasa máxima</div>
            <div className="font-medium">{product.interestRate.max}%</div>
          </div>
        </div>
      )}

      {product.limit && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="p-2 bg-secondary/40 rounded-md">
            <div className="text-xs text-muted-foreground">Límite mín.</div>
            <div className="font-medium">€{product.limit.min.toLocaleString()}</div>
          </div>
          <div className="p-2 bg-secondary/40 rounded-md">
            <div className="text-xs text-muted-foreground">Límite máx.</div>
            <div className="font-medium">€{product.limit.max.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors button-shine">
          Simular
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
