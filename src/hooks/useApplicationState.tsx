
import React, { createContext, useContext, useState } from 'react';
import { ApplicationState, Customer, Product, Performance, CallInfo } from '@/lib/types';

// Sample data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ana',
    lastName: 'García',
    creditScore: 720,
    income: 45000,
    age: 34,
    address: 'Calle Principal 123, Madrid',
    phone: '+34 612 345 678',
    email: 'ana.garcia@email.com',
    products: [
      {
        id: 'p1',
        type: 'creditCard',
        name: 'Tarjeta Oro',
        balance: 1200,
        limit: 5000,
        status: 'active',
      },
      {
        id: 'p2',
        type: 'savings',
        name: 'Cuenta Ahorro Plus',
        balance: 8500,
        status: 'active',
      },
    ],
    preferences: ['Viajes', 'Tecnología', 'Restaurantes'],
    propensity: {
      creditCards: 0.3,
      loans: 0.7,
      insurance: 0.5,
      savings: 0.2,
    },
  },
  {
    id: '2',
    name: 'Carlos',
    lastName: 'Martínez',
    creditScore: 680,
    income: 38000,
    age: 29,
    address: 'Avenida Libertad 45, Barcelona',
    phone: '+34 623 456 789',
    email: 'carlos.martinez@email.com',
    products: [
      {
        id: 'p3',
        type: 'loan',
        name: 'Préstamo Personal',
        balance: 15000,
        rate: 7.5,
        status: 'active',
      },
    ],
    preferences: ['Deportes', 'Música', 'Cine'],
    propensity: {
      creditCards: 0.6,
      loans: 0.2,
      insurance: 0.8,
      savings: 0.4,
    },
  },
];

const mockProducts: Product[] = [
  {
    id: 'product1',
    type: 'creditCard',
    name: 'Tarjeta Platinum',
    description: 'Nuestra tarjeta premium con beneficios exclusivos y acumulación de puntos.',
    benefits: [
      'Acumulación de 2 puntos por cada €1 de compra',
      'Acceso a salas VIP en aeropuertos',
      'Seguro de viaje gratuito',
      'Descuentos en restaurantes seleccionados'
    ],
    requirements: [
      'Ingresos anuales superiores a €35,000',
      'Historial crediticio favorable',
      'Mayor de 25 años'
    ],
    terms: [
      'Tasa de interés anual: 22.9%',
      'Comisión anual: €120',
      'Periodo de gracia: 25 días'
    ],
    imageUrl: 'platinum-card.png',
    limit: {
      min: 3000,
      max: 30000,
    },
  },
  {
    id: 'product2',
    type: 'loan',
    name: 'Préstamo Flexible',
    description: 'Préstamo personal adaptado a tus necesidades con plazos flexibles y tasas competitivas.',
    benefits: [
      'Hasta €50,000 en financiación',
      'Plazos de 12 a 60 meses',
      'Sin penalización por cancelación anticipada',
      'Aprobación rápida en 24 horas'
    ],
    requirements: [
      'Ingresos mensuales demostrables',
      'Historial crediticio favorable',
      'Mayor de 21 años'
    ],
    terms: [
      'Tasa de interés desde 6.95% TIN',
      'Comisión de apertura: 1%',
      'Seguro opcional'
    ],
    interestRate: {
      min: 6.95,
      max: 12.95,
    },
    limit: {
      min: 3000,
      max: 50000,
    },
  },
  {
    id: 'product3',
    type: 'insurance',
    name: 'Seguro de Vida Plus',
    description: 'Protección completa para ti y tu familia con coberturas personalizables.',
    benefits: [
      'Cobertura por fallecimiento e invalidez',
      'Indemnización por enfermedades graves',
      'Asistencia médica telefónica 24/7',
      'Servicios de segunda opinión médica'
    ],
    requirements: [
      'Edad entre 18 y 65 años',
      'Completar cuestionario de salud',
      'Documento de identidad válido'
    ],
    terms: [
      'Prima mensual desde €15',
      'Revisión anual de condiciones',
      'Periodo de carencia: 3 meses'
    ],
  },
  {
    id: 'product4',
    type: 'savings',
    name: 'Cuenta Rentabilidad Alta',
    description: 'Cuenta de ahorro con alta rentabilidad y disponibilidad total de fondos.',
    benefits: [
      'Rentabilidad del 3% TAE primer año',
      'Sin comisiones de mantenimiento',
      'Transferencias gratuitas',
      'Tarjeta de débito sin coste'
    ],
    requirements: [
      'Depósito inicial de €1,000',
      'Domiciliación de ingresos (opcional)',
      'Mayor de 18 años'
    ],
    terms: [
      'Liquidación trimestral de intereses',
      'Sin compromiso de permanencia',
      'Saldo máximo remunerado: €50,000'
    ],
    interestRate: {
      min: 3,
      max: 3,
    },
  },
];

const mockPerformance: Performance = {
  daily: {
    sales: 4,
    goal: 6,
  },
  weekly: {
    sales: 22,
    goal: 30,
  },
  monthly: {
    sales: 87,
    goal: 120,
  },
  products: {
    creditCards: 32,
    loans: 28,
    insurance: 15,
    savings: 12,
  },
  badges: [
    {
      id: 'badge1',
      name: 'Ventas Estrella',
      description: 'Superar el objetivo mensual de ventas',
      earned: true,
      icon: 'star',
    },
    {
      id: 'badge2',
      name: 'Especialista en Préstamos',
      description: 'Vender más de 20 préstamos en un mes',
      earned: true,
      icon: 'money',
    },
    {
      id: 'badge3',
      name: 'Maestro de Seguros',
      description: 'Vender más de 15 seguros en un mes',
      earned: false,
      icon: 'shield',
    }
  ],
  level: {
    current: 3,
    progress: 65,
    nextMilestone: 100,
  },
};

const mockCall: CallInfo = {
  customerId: '1',
  duration: 127, // seconds
  status: 'active',
  startTime: new Date(),
};

const initialState: ApplicationState = {
  currentCustomer: mockCustomers[0],
  nextCustomer: mockCustomers[1],
  currentCall: mockCall,
  performance: mockPerformance,
  productCatalog: mockProducts,
};

const ApplicationStateContext = createContext<{
  state: ApplicationState;
  setCustomer: (customer: Customer) => void;
}>({
  state: initialState,
  setCustomer: () => { },
});

export const ApplicationStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ApplicationState>(initialState);

  const setCustomer = (customer: Customer) => {
    setState((prev) => ({
      ...prev,
      currentCustomer: customer,
    }));
  };

  return (
    <ApplicationStateContext.Provider value={{ state, setCustomer }}>
      {children}
    </ApplicationStateContext.Provider>
  );
};

export const useApplicationState = () => useContext(ApplicationStateContext);
