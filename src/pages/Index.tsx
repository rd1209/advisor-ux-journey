
import React, { useEffect, useState } from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import CustomerCard from '@/components/CustomerCard';
import PerformanceCard from '@/components/PerformanceCard';
import ProductCard from '@/components/ProductCard';
import AdvisorStatus from '@/components/AdvisorStatus';
import { CircleDollarSign, Clock, Phone, CreditCard, BanknoteIcon, ShieldCheck, PiggyBank, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { state } = useApplicationState();
  const [callDuration, setCallDuration] = useState(state.currentCall?.duration || 0);

  useEffect(() => {
    if (state.currentCall?.status === 'active') {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.currentCall]);

  // Find the product with highest propensity
  const getRecommendedProduct = () => {
    if (!state.currentCustomer) return null;
    
    const propensity = state.currentCustomer.propensity;
    const highestPropensity = Math.max(
      propensity.creditCards,
      propensity.loans,
      propensity.insurance,
      propensity.savings
    );
    
    let productType: 'creditCard' | 'loan' | 'insurance' | 'savings';
    
    if (highestPropensity === propensity.creditCards) productType = 'creditCard';
    else if (highestPropensity === propensity.loans) productType = 'loan';
    else if (highestPropensity === propensity.insurance) productType = 'insurance';
    else productType = 'savings';
    
    return state.productCatalog.find(p => p.type === productType);
  };

  const recommendedProduct = getRecommendedProduct();

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 animate-fade-in">
      <div className="space-y-6">
        {/* Advisor Status */}
        <AdvisorStatus 
          name="Adrián García"
          status={state.currentCall?.status || 'offline'}
          callDuration={callDuration}
        />

        {/* Top summary stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <CircleDollarSign size={16} className="text-blue-600" />
              </div>
              <div className="text-sm text-muted-foreground">Ventas totales</div>
            </div>
            <div className="text-2xl font-semibold">{state.performance.monthly.sales}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Meta: {state.performance.monthly.goal}
            </div>
            <div className="progress-bar mt-2">
              <div
                className="progress-value"
                style={{ width: `${(state.performance.monthly.sales / state.performance.monthly.goal) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Clock size={16} className="text-green-600" />
              </div>
              <div className="text-sm text-muted-foreground">Duración llamada</div>
            </div>
            <div className="text-2xl font-semibold">
              {Math.floor(callDuration / 60)}:{callDuration % 60 < 10 ? '0' : ''}{callDuration % 60}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Promedio: 5:42
            </div>
            <div className="progress-bar mt-2">
              <div
                className="progress-value bg-green-500"
                style={{ width: `${Math.min(100, (callDuration / 600) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Phone size={16} className="text-purple-600" />
              </div>
              <div className="text-sm text-muted-foreground">Llamadas hoy</div>
            </div>
            <div className="text-2xl font-semibold">12</div>
            <div className="text-xs text-muted-foreground mt-1">
              Meta diaria: 20
            </div>
            <div className="progress-bar mt-2">
              <div
                className="progress-value bg-purple-500"
                style={{ width: '60%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Cliente actual</h2>
                <Link 
                  to="/customer" 
                  className="text-primary text-sm flex items-center hover:underline"
                >
                  <span>Ver detalle</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              {state.currentCustomer && (
                <CustomerCard 
                  customer={state.currentCustomer} 
                  callDuration={callDuration}
                />
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Próximo cliente</h2>
              </div>
              {state.nextCustomer && (
                <CustomerCard 
                  customer={state.nextCustomer} 
                  isNext={true}
                />
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Producto recomendado</h2>
                <Link 
                  to="/commercial" 
                  className="text-primary text-sm flex items-center hover:underline"
                >
                  <span>Ver todos</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              {recommendedProduct && (
                <ProductCard 
                  product={recommendedProduct}
                  recommended={true}
                />
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Acciones rápidas</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/commercial" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CreditCard size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ver productos</div>
                    <div className="font-medium">Tarjetas</div>
                  </div>
                </Link>
                <Link to="/commercial" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <BanknoteIcon size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ver productos</div>
                    <div className="font-medium">Préstamos</div>
                  </div>
                </Link>
                <Link to="/contracting" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Iniciar</div>
                    <div className="font-medium">Contratación</div>
                  </div>
                </Link>
                <Link to="/dashboard" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <PiggyBank size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ver mis</div>
                    <div className="font-medium">Resultados</div>
                  </div>
                </Link>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Mi rendimiento</h2>
                <Link 
                  to="/dashboard" 
                  className="text-primary text-sm flex items-center hover:underline"
                >
                  <span>Ver detalle</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              <PerformanceCard performance={state.performance} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
