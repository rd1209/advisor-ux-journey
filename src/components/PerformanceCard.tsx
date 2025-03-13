
import React from 'react';
import { CircleDollarSign, Trophy, BarChart3 } from 'lucide-react';
import { Performance } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PerformanceCardProps {
  performance: Performance;
  className?: string;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ performance, className }) => {
  const getProgressColor = (value: number, goal: number) => {
    const percentage = (value / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn("glass-card rounded-xl p-4", className)}>
      <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
        <Trophy size={18} className="text-primary" />
        <span>Rendimiento</span>
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-2 rounded-lg bg-secondary/50">
          <div className="text-xs text-muted-foreground">Hoy</div>
          <div className="font-medium">{performance.daily.sales} / {performance.daily.goal}</div>
          <div className="progress-bar mt-1">
            <div
              className={cn("progress-value", getProgressColor(performance.daily.sales, performance.daily.goal))}
              style={{ width: `${Math.min(100, (performance.daily.sales / performance.daily.goal) * 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/50">
          <div className="text-xs text-muted-foreground">Semanal</div>
          <div className="font-medium">{performance.weekly.sales} / {performance.weekly.goal}</div>
          <div className="progress-bar mt-1">
            <div
              className={cn("progress-value", getProgressColor(performance.weekly.sales, performance.weekly.goal))}
              style={{ width: `${Math.min(100, (performance.weekly.sales / performance.weekly.goal) * 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/50">
          <div className="text-xs text-muted-foreground">Mensual</div>
          <div className="font-medium">{performance.monthly.sales} / {performance.monthly.goal}</div>
          <div className="progress-bar mt-1">
            <div
              className={cn("progress-value", getProgressColor(performance.monthly.sales, performance.monthly.goal))}
              style={{ width: `${Math.min(100, (performance.monthly.sales / performance.monthly.goal) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-medium mb-2 flex items-center gap-1">
          <BarChart3 size={14} />
          <span>Productos vendidos</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tarjetas:</span>
            <span className="font-medium">{performance.products.creditCards}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Préstamos:</span>
            <span className="font-medium">{performance.products.loans}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seguros:</span>
            <span className="font-medium">{performance.products.insurance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cuentas:</span>
            <span className="font-medium">{performance.products.savings}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Nivel {performance.level.current}</div>
          <div className="text-xs text-muted-foreground">{performance.level.progress}/{performance.level.nextMilestone}</div>
        </div>
        <div className="progress-bar mt-1">
          <div
            className="progress-value bg-primary/80"
            style={{ width: `${(performance.level.progress / performance.level.nextMilestone) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;
