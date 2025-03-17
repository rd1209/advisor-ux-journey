
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, a
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calculator, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';

type SimulatorType = 'creditCard' | 'loan' | 'insurance' | 'savings';

interface RateSimulatorProps {
  type: SimulatorType;
  onClose: () => void;
}

export const RateSimulator = ({ type, onClose }: RateSimulatorProps) => {
  const [result, setResult] = useState<{
    monthlyPayment?: number;
    totalPayment?: number;
    interestRate?: number;
    term?: number;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      amount: type === 'creditCard' ? 3000 : 10000,
      term: type === 'creditCard' ? 12 : 48,
      interestRate: getDefaultRate(type),
    },
  });

  function getDefaultRate(type: SimulatorType): number {
    switch (type) {
      case 'creditCard': return 21.9;
      case 'loan': return 6.95;
      case 'insurance': return 0;
      case 'savings': return 3.0;
      default: return 0;
    }
  }

  const getMinAmount = (type: SimulatorType): number => {
    switch (type) {
      case 'creditCard': return 1000;
      case 'loan': return 3000;
      case 'insurance': return 50;
      case 'savings': return 1000;
      default: return 0;
    }
  };

  const getMaxAmount = (type: SimulatorType): number => {
    switch (type) {
      case 'creditCard': return 30000;
      case 'loan': return 50000;
      case 'insurance': return 1000;
      case 'savings': return 100000;
      default: return 0;
    }
  };

  const getTitle = (type: SimulatorType): string => {
    switch (type) {
      case 'creditCard': return 'Simulador de Tarjeta de Crédito';
      case 'loan': return 'Simulador de Préstamo';
      case 'insurance': return 'Simulador de Seguro';
      case 'savings': return 'Simulador de Ahorro';
      default: return 'Simulador';
    }
  };

  const onSubmit = (data: any) => {
    // For credit cards and loans
    if (type === 'creditCard' || type === 'loan') {
      const monthlyRate = data.interestRate / 100 / 12;
      const totalMonths = data.term;
      const loanAmount = data.amount;
      
      // Calculate monthly payment
      const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
      const totalPayment = monthlyPayment * totalMonths;
      
      setResult({
        monthlyPayment,
        totalPayment,
        interestRate: data.interestRate,
        term: data.term
      });
    } 
    // For savings
    else if (type === 'savings') {
      const annualRate = data.interestRate / 100;
      const years = data.term / 12;
      const initialAmount = data.amount;
      
      // Simple interest calculation
      const interest = initialAmount * annualRate * years;
      const finalAmount = initialAmount + interest;
      
      setResult({
        totalPayment: finalAmount,
        interestRate: data.interestRate,
        term: data.term
      });
    }
    // For insurance
    else if (type === 'insurance') {
      // Simple calculation for insurance premium
      const monthlyPremium = data.amount / 12;
      
      setResult({
        monthlyPayment: monthlyPremium,
        totalPayment: data.amount,
        term: 12
      });
    }
  };

  const resetForm = () => {
    form.reset();
    setResult(null);
  };

  return (
    <Card className="glass-card shadow-md mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="text-primary" size={20} />
          {getTitle(type)}
        </CardTitle>
        <CardDescription>
          Simule las cuotas y plazos para el cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad (€)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        min={getMinAmount(type)}
                        max={getMaxAmount(type)}
                      />
                    </FormControl>
                  </div>
                  <FormDescription className="flex justify-between text-xs">
                    <span>Min: {getMinAmount(type)}€</span>
                    <span>Max: {getMaxAmount(type)}€</span>
                  </FormDescription>
                </FormItem>
              )}
            />

            {type !== 'insurance' && (
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plazo (meses)</FormLabel>
                    <div className="pt-2">
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={type === 'creditCard' ? 6 : 12}
                          max={type === 'creditCard' ? 36 : 120}
                          step={type === 'creditCard' ? 3 : 12}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="flex justify-between">
                      <span>{field.value} meses</span>
                      <span>{(field.value / 12).toFixed(1)} años</span>
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            {(type === 'creditCard' || type === 'loan') && (
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de interés (%)</FormLabel>
                    <div className="pt-2">
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={type === 'creditCard' ? 16 : 4}
                          max={type === 'creditCard' ? 26 : 15}
                          step={0.5}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      {field.value}% {type === 'creditCard' ? 'TIN' : 'TIN'}
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={resetForm} type="button">
                <RefreshCw size={16} className="mr-2" />
                Reiniciar
              </Button>
              <Button type="submit">Calcular</Button>
            </div>
          </form>
        </Form>

        {result && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border">
            <h4 className="font-medium mb-3">Resultados:</h4>
            <div className="space-y-2">
              {result.monthlyPayment && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cuota mensual:</span>
                  <span className="font-medium">{result.monthlyPayment.toFixed(2)}€</span>
                </div>
              )}
              {result.totalPayment && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {type === 'savings' ? 'Monto final:' : 'Total a pagar:'}
                  </span>
                  <span className="font-medium">{result.totalPayment.toFixed(2)}€</span>
                </div>
              )}
              {result.interestRate && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tasa de interés:</span>
                  <span className="font-medium">{result.interestRate}%</span>
                </div>
              )}
              {result.term && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plazo:</span>
                  <span className="font-medium">{result.term} meses</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
