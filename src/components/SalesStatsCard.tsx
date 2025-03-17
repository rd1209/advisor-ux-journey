
import React from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { CreditCard, Landmark, ShieldCheck, PiggyBank } from 'lucide-react';

interface SalesStatsCardProps {
  className?: string;
}

const SalesStatsCard: React.FC<SalesStatsCardProps> = ({ className }) => {
  const { state } = useApplicationState();
  const { performance } = state;

  // Sample data - in a real app, this would come from API
  const weeklySalesData = [
    { day: 'Semana 1', creditCards: 5, loans: 3, insurance: 2, savings: 1 },
    { day: 'Semana 2', creditCards: 7, loans: 4, insurance: 1, savings: 2 },
    { day: 'Semana 3', creditCards: 4, loans: 6, insurance: 3, savings: 1 },
    { day: 'Semana 4', creditCards: 8, loans: 5, insurance: 2, savings: 3 },
  ];

  const totalsByWeek = weeklySalesData.map(week => ({
    day: week.day,
    total: week.creditCards + week.loans + week.insurance + week.savings
  }));

  const config = {
    creditCards: { 
      label: 'Tarjetas', 
      theme: { light: '#8B5CF6', dark: '#A78BFA' } 
    },
    loans: { 
      label: 'Préstamos', 
      theme: { light: '#F59E0B', dark: '#FBBF24' } 
    },
    insurance: { 
      label: 'Seguros', 
      theme: { light: '#10B981', dark: '#34D399' } 
    },
    savings: { 
      label: 'Cuentas', 
      theme: { light: '#3B82F6', dark: '#60A5FA' } 
    },
    total: {
      label: 'Total',
      theme: { light: '#6366F1', dark: '#818CF8' }
    }
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-secondary/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground">Tarjetas</div>
              <CreditCard size={14} className="text-primary" />
            </div>
            <div className="text-xl font-medium">{performance.products.creditCards}</div>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground">Préstamos</div>
              <Landmark size={14} className="text-orange-500" />
            </div>
            <div className="text-xl font-medium">{performance.products.loans}</div>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground">Seguros</div>
              <ShieldCheck size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-medium">{performance.products.insurance}</div>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground">Cuentas</div>
              <PiggyBank size={14} className="text-blue-500" />
            </div>
            <div className="text-xl font-medium">{performance.products.savings}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44">
            <div className="text-sm font-medium mb-2">Ventas semanales por producto</div>
            <ChartContainer config={config}>
              <AreaChart data={weeklySalesData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="creditCards" 
                  stackId="1" 
                  stroke="var(--color-creditCards)" 
                  fill="var(--color-creditCards)" 
                  name="creditCards"
                />
                <Area 
                  type="monotone" 
                  dataKey="loans" 
                  stackId="1" 
                  stroke="var(--color-loans)" 
                  fill="var(--color-loans)" 
                  name="loans"
                />
                <Area 
                  type="monotone" 
                  dataKey="insurance" 
                  stackId="1" 
                  stroke="var(--color-insurance)" 
                  fill="var(--color-insurance)" 
                  name="insurance"
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stackId="1" 
                  stroke="var(--color-savings)" 
                  fill="var(--color-savings)" 
                  name="savings"
                />
              </AreaChart>
            </ChartContainer>
          </div>
          
          <div className="h-44">
            <div className="text-sm font-medium mb-2">Total de ventas semanal</div>
            <ChartContainer config={config}>
              <LineChart data={totalsByWeek} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--color-total)" 
                  strokeWidth={2}
                  name="total"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesStatsCard;
