
import React from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  CreditCard, 
  PiggyBank, 
  Landmark, 
  ShieldCheck
} from 'lucide-react';
import PerformanceCard from '@/components/PerformanceCard';
import SalesStatsCard from '@/components/SalesStatsCard';
import BadgesCard from '@/components/BadgesCard';

const DashboardPage = () => {
  const { state } = useApplicationState();
  const { performance } = state;
  
  const dailySalesData = [
    { day: 'Lun', sales: 2, goal: 6 },
    { day: 'Mar', sales: 4, goal: 6 },
    { day: 'Mié', sales: 3, goal: 6 },
    { day: 'Jue', sales: 5, goal: 6 },
    { day: 'Vie', sales: 7, goal: 6 },
    { day: 'Sáb', sales: 2, goal: 3 },
    { day: 'Dom', sales: 1, goal: 3 },
  ];

  const productTypesData = [
    { name: 'Tarjetas', value: performance.products.creditCards, icon: <CreditCard size={16} /> },
    { name: 'Préstamos', value: performance.products.loans, icon: <Landmark size={16} /> },
    { name: 'Seguros', value: performance.products.insurance, icon: <ShieldCheck size={16} /> },
    { name: 'Cuentas', value: performance.products.savings, icon: <PiggyBank size={16} /> },
  ];

  const config = {
    sales: { label: 'Ventas', color: '#8B5CF6' },
    goal: { label: 'Meta', color: '#D1D5DB' },
  };

  return (
    <div className="px-6 py-6 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">Panel de Resultados</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Card */}
        <PerformanceCard performance={performance} />
        
        {/* Sales Stats Card */}
        <SalesStatsCard className="lg:col-span-2" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Sales Chart */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp size={18} className="text-primary" />
              Ventas Diarias
            </CardTitle>
            <CardDescription>Comparativa de ventas vs. metas diarias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={config}>
                <BarChart data={dailySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" name="sales" />
                  <Bar dataKey="goal" fill="var(--color-goal)" name="goal" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Badges Card */}
        <BadgesCard badges={performance.badges} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target size={18} className="text-primary" />
              Productos Vendidos
            </CardTitle>
            <CardDescription>Detalles de ventas por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>% del Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productTypesData.map((product) => {
                  const totalProducts = Object.values(performance.products).reduce((sum, val) => sum + val, 0);
                  const percentage = Math.round((product.value / totalProducts) * 100);
                  
                  return (
                    <TableRow key={product.name}>
                      <TableCell className="flex items-center gap-2">
                        {product.icon}
                        {product.name}
                      </TableCell>
                      <TableCell>{product.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-24 h-2" />
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Gamification Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy size={18} className="text-primary" />
              Gamificación
            </CardTitle>
            <CardDescription>Tu progreso y recompensas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Award className="text-primary" size={18} />
                  <span className="font-medium">Nivel {performance.level.current}</span>
                </div>
                <Badge variant="outline" className="text-primary">
                  {performance.level.progress}/{performance.level.nextMilestone} puntos
                </Badge>
              </div>
              <Progress value={(performance.level.progress / performance.level.nextMilestone) * 100} className="h-3" />
            </div>
            
            <div className="rounded-lg bg-primary/5 p-4 border">
              <h4 className="font-medium mb-2">Próxima recompensa:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Al alcanzar el <span className="font-medium">Nivel {performance.level.current + 1}</span>:
              </p>
              <ul className="text-sm space-y-1 ml-5 list-disc">
                <li>Bono adicional de productividad</li>
                <li>2 días adicionales de vacaciones</li>
                <li>Acceso a programa de mentoring ejecutivo</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
