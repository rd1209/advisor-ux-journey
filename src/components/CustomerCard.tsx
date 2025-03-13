
import React from 'react';
import { Customer } from '@/lib/types';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CustomerCardProps {
  customer: Customer;
  callDuration?: number;
  isNext?: boolean;
  className?: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  callDuration,
  isNext = false,
  className,
}) => {
  // Format call duration from seconds to minutes:seconds
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate credit score color
  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={cn(
      'glass-card rounded-xl p-4',
      isNext ? 'opacity-80' : '',
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            {isNext && (
              <span className="badge badge-primary">Próximo Cliente</span>
            )}
            {!isNext && callDuration !== undefined && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>
          <h3 className="font-medium text-lg mt-1">
            {customer.name} {customer.lastName}
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-muted-foreground">Score crediticio</div>
          <div className={cn("font-semibold", getCreditScoreColor(customer.creditScore))}>
            {customer.creditScore}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={14} />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail size={14} />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={14} />
          <span>{customer.address}</span>
        </div>
      </div>

      {!isNext && (
        <>
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Productos contratados</div>
            <div className="flex flex-wrap gap-2">
              {customer.products.map((product) => (
                <span key={product.id} className="badge badge-info">
                  {product.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Propensión a compra</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Tarjetas</div>
                <div className="progress-bar mt-1">
                  <div
                    className="progress-value"
                    style={{ width: `${customer.propensity.creditCards * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Préstamos</div>
                <div className="progress-bar mt-1">
                  <div
                    className="progress-value"
                    style={{ width: `${customer.propensity.loans * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Seguros</div>
                <div className="progress-bar mt-1">
                  <div
                    className="progress-value"
                    style={{ width: `${customer.propensity.insurance * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Ahorros</div>
                <div className="progress-bar mt-1">
                  <div
                    className="progress-value"
                    style={{ width: `${customer.propensity.savings * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerCard;
