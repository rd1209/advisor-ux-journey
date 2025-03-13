
import React, { useEffect, useState } from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import CustomerCard from '@/components/CustomerCard';
import PerformanceCard from '@/components/PerformanceCard';
import ProductCard from '@/components/ProductCard';
import { CircleDollarSign, Clock, Phone, Users, CreditCard, BanknoteIcon, ShieldCheck, PiggyBank, ArrowRight } from 'lucide-react';
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
        {/* Top summary stats */}
        <div className="grid grid-cols-4 gap-4">
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

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Users size={16} className="text-amber-600" />
              </div>
              <div className="text-sm text-muted-foreground">Clientes en espera</div>
            </div>
            <div className="text-2xl font-semibold">5</div>
            <div className="text-xs text-muted-foreground mt-1">
              Tiempo promedio: 3:12
            </div>
            <div className="progress-bar mt-2">
              <div
                className="progress-value bg-amber-500"
                style={{ width: '40%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-3 gap-6">
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
            
            <PerformanceCard performance={state.performance} />
          </div>

          {/* Middle column */}
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
                <h2 className="text-lg font-medium">Productos disponibles</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/commercial" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CreditCard size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Tarjetas</div>
                    <div className="font-medium">2 productos</div>
                  </div>
                </Link>
                <Link to="/commercial" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <BanknoteIcon size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Préstamos</div>
                    <div className="font-medium">3 productos</div>
                  </div>
                </Link>
                <Link to="/commercial" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Seguros</div>
                    <div className="font-medium">4 productos</div>
                  </div>
                </Link>
                <Link to="/commercial" className="glass-card p-3 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <PiggyBank size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Cuentas</div>
                    <div className="font-medium">2 productos</div>
                  </div>
                </Link>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Contratación</h2>
                <Link 
                  to="/contracting" 
                  className="text-primary text-sm flex items-center hover:underline"
                >
                  <span>Iniciar</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                    <BanknoteIcon size={24} className="text-primary" />
                  </div>
                </div>
                <h3 className="font-medium mb-1">Iniciar contratación</h3>
                <p className="text-sm text-muted-foreground mb-4">Completa el proceso de solicitud para el cliente actual</p>
                <Link
                  to="/contracting"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-block hover:bg-primary/90 transition-colors button-shine"
                >
                  Iniciar proceso
                </Link>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Ayuda rápida</h2>
                <Link 
                  to="/faq" 
                  className="text-primary text-sm flex items-center hover:underline"
                >
                  <span>Ver todas</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="glass-card rounded-xl p-4">
                <div className="space-y-3">
                  <Link to="/faq" className="block p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="text-sm font-medium">¿Cómo explicar las tasas de interés?</div>
                    <div className="text-xs text-muted-foreground mt-1">Guía para explicar conceptos financieros</div>
                  </Link>
                  <Link to="/faq" className="block p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="text-sm font-medium">Proceso de verificación de identidad</div>
                    <div className="text-xs text-muted-foreground mt-1">Pasos para validar la identidad del cliente</div>
                  </Link>
                  <Link to="/faq" className="block p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="text-sm font-medium">Objeciones comunes sobre seguros</div>
                    <div className="text-xs text-muted-foreground mt-1">Cómo manejar las preguntas frecuentes</div>
                  </Link>
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Buscar en ayuda rápida..." 
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Rendimiento del equipo</h2>
                <Link 
                  to="/dashboard" 
                  className="text-primary text-sm flex items-center hover:underline"
                >
                  <span>Ver completo</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="glass-card rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        AG
                      </div>
                      <div>
                        <div className="text-sm font-medium">Adrián García</div>
                        <div className="text-xs text-muted-foreground">Tú</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">87</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        MT
                      </div>
                      <div>
                        <div className="text-sm font-medium">María Torres</div>
                        <div className="text-xs text-muted-foreground">Asesora</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">92</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        JR
                      </div>
                      <div>
                        <div className="text-sm font-medium">Javier Rodríguez</div>
                        <div className="text-xs text-muted-foreground">Asesor</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">85</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        LM
                      </div>
                      <div>
                        <div className="text-sm font-medium">Laura Méndez</div>
                        <div className="text-xs text-muted-foreground">Asesora</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">78</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Tu posición en el equipo</div>
                  <div className="text-lg font-semibold">3<span className="text-muted-foreground text-sm"> de 12</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
