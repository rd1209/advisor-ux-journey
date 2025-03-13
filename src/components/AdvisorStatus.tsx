
import React from 'react';
import { Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivityStatus = 'active' | 'waiting' | 'completed' | 'offline';

interface AdvisorStatusProps {
  name: string;
  status: ActivityStatus;
  callDuration?: number;
  className?: string;
}

const AdvisorStatus: React.FC<AdvisorStatusProps> = ({ 
  name, 
  status, 
  callDuration = 0,
  className 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: <Phone size={18} />,
          label: 'Llamada activa',
          color: 'bg-green-100 text-green-600',
          indicator: 'bg-green-500'
        };
      case 'waiting':
        return {
          icon: <Clock size={18} />,
          label: 'En espera',
          color: 'bg-amber-100 text-amber-600',
          indicator: 'bg-amber-500'
        };
      case 'completed':
        return {
          icon: <CheckCircle size={18} />,
          label: 'Llamada completada',
          color: 'bg-blue-100 text-blue-600',
          indicator: 'bg-blue-500'
        };
      case 'offline':
        return {
          icon: <AlertCircle size={18} />,
          label: 'Desconectado',
          color: 'bg-gray-100 text-gray-600',
          indicator: 'bg-gray-500'
        };
      default:
        return {
          icon: <Clock size={18} />,
          label: 'Estado desconocido',
          color: 'bg-gray-100 text-gray-600',
          indicator: 'bg-gray-500'
        };
    }
  };
  
  const statusConfig = getStatusConfig();
  const minutes = Math.floor(callDuration / 60);
  const seconds = callDuration % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
  return (
    <div className={cn("glass-card p-4 rounded-xl", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            {name.split(' ').map(part => part[0]).join('')}
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">Asesor Financiero</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", statusConfig.color)}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse", statusConfig.indicator)}></div>
            <span className="text-sm font-medium">{statusConfig.label}</span>
          </div>
          
          {status === 'active' && (
            <div className="bg-secondary px-3 py-1.5 rounded-full text-sm font-medium">
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorStatus;
