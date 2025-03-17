
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useApplicationState } from '@/hooks/useApplicationState';
import ProductCard from '@/components/ProductCard';
import { RateSimulator } from '@/components/RateSimulator';
import { ProductChatbot } from '@/components/ProductChatbot';
import { CreditCard, BanknoteIcon, Shield, PiggyBank, Bot, Calculator } from 'lucide-react';

const CommercialPage = () => {
  const { state } = useApplicationState();
  const { productCatalog } = state;
  
  // Group products by type
  const creditCards = productCatalog.filter(product => product.type === 'creditCard');
  const loans = productCatalog.filter(product => product.type === 'loan');
  const insurance = productCatalog.filter(product => product.type === 'insurance');
  const savings = productCatalog.filter(product => product.type === 'savings');
  
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorType, setSimulatorType] = useState<'creditCard' | 'loan' | 'insurance' | 'savings'>('creditCard');
  
  const handleShowSimulator = (type: 'creditCard' | 'loan' | 'insurance' | 'savings') => {
    setSimulatorType(type);
    setShowSimulator(true);
  };

  return (
    <div className="px-6 py-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Información Comercial</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => handleShowSimulator(simulatorType)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <Calculator size={18} />
            Simulador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="creditCards" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-background border rounded-lg p-1 overflow-x-auto flex-nowrap">
              <TabsTrigger value="creditCards" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CreditCard size={16} />
                <span>Tarjetas de Crédito</span>
              </TabsTrigger>
              <TabsTrigger value="loans" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BanknoteIcon size={16} />
                <span>Préstamos</span>
              </TabsTrigger>
              <TabsTrigger value="insurance" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield size={16} />
                <span>Seguros</span>
              </TabsTrigger>
              <TabsTrigger value="savings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <PiggyBank size={16} />
                <span>Cuentas de Ahorro</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="creditCards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creditCards.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    recommended={index === 0} 
                    className="h-full"
                  />
                ))}
              </div>
              
              <div className="glass-card p-4 rounded-xl mt-6 bg-blue-50/30 border border-blue-200">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <CreditCard className="text-blue-500" />
                  Beneficios de venta cruzada
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Al contratar una tarjeta de crédito junto con otro producto, el cliente recibe:
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-blue-700 font-medium">1</span>
                    </div>
                    <span>Bonificación de 5.000 puntos de bienvenida (equivalente a 50€)</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <span className="text-blue-700 font-medium">2</span>
                    </div>
                    <span>Exención de comisiones de mantenimiento en la cuenta por 1 año</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="loans" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loans.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    recommended={index === 0} 
                    className="h-full"
                  />
                ))}
              </div>
              
              <div className="glass-card p-4 rounded-xl mt-6 bg-green-50/30 border border-green-200">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <BanknoteIcon className="text-green-500" />
                  Beneficios de venta cruzada
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Al contratar un préstamo junto con otro producto, el cliente recibe:
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <span className="text-green-700 font-medium">1</span>
                    </div>
                    <span>Reducción de 0.25% en la tasa de interés</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <span className="text-green-700 font-medium">2</span>
                    </div>
                    <span>Sin comisión de apertura</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="insurance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insurance.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    recommended={index === 0} 
                    className="h-full"
                  />
                ))}
              </div>
              
              <div className="glass-card p-4 rounded-xl mt-6 bg-purple-50/30 border border-purple-200">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Shield className="text-purple-500" />
                  Beneficios de venta cruzada
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Al contratar un seguro junto con otro producto, el cliente recibe:
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <span className="text-purple-700 font-medium">1</span>
                    </div>
                    <span>10% de descuento en la prima anual</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <span className="text-purple-700 font-medium">2</span>
                    </div>
                    <span>Cobertura extendida sin coste adicional</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="savings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savings.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    recommended={index === 0} 
                    className="h-full"
                  />
                ))}
              </div>
              
              <div className="glass-card p-4 rounded-xl mt-6 bg-amber-50/30 border border-amber-200">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <PiggyBank className="text-amber-500" />
                  Beneficios de venta cruzada
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Al contratar una cuenta de ahorro junto con otro producto, el cliente recibe:
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                      <span className="text-amber-700 font-medium">1</span>
                    </div>
                    <span>Bonificación de 50€ en la cuenta al abrir</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                      <span className="text-amber-700 font-medium">2</span>
                    </div>
                    <span>Incremento de 0.25% en la tasa de interés del primer año</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <ProductChatbot />
          {showSimulator && (
            <RateSimulator 
              type={simulatorType} 
              onClose={() => setShowSimulator(false)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommercialPage;
