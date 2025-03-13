
import React from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import { Users, Phone, Mail, Home, Calendar, Wallet, CreditCard, BanknoteIcon, Shield, PiggyBank, Sparkles } from 'lucide-react';
import TabView from '@/components/TabView';
import ProductCard from '@/components/ProductCard';

const CustomerDetails = () => {
  const { state } = useApplicationState();
  const customer = state.currentCustomer;

  if (!customer) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6 flex justify-center items-center">
        <div className="text-center">
          <div className="text-xl font-medium">No hay cliente seleccionado</div>
          <p className="text-muted-foreground">No hay información disponible</p>
        </div>
      </div>
    );
  }

  const getProductsOfType = (type: 'creditCard' | 'loan' | 'insurance' | 'savings') => {
    return customer.products.filter(p => p.type === type);
  };

  const creditCards = getProductsOfType('creditCard');
  const loans = getProductsOfType('loan');
  const insurance = getProductsOfType('insurance');
  const savings = getProductsOfType('savings');

  const getRecommendedProductsOfType = (type: 'creditCard' | 'loan' | 'insurance' | 'savings') => {
    return state.productCatalog
      .filter(p => p.type === type)
      .map(product => ({
        product,
        propensity: customer.propensity[type]
      }))
      .filter(({ propensity }) => propensity > 0.4) // Only show products with higher propensity
      .sort((a, b) => b.propensity - a.propensity) // Sort by propensity
      .map(({ product }) => product);
  };

  const recommendedCreditCards = getRecommendedProductsOfType('creditCard');
  const recommendedLoans = getRecommendedProductsOfType('loan');
  const recommendedInsurance = getRecommendedProductsOfType('insurance');
  const recommendedSavings = getRecommendedProductsOfType('savings');

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 animate-fade-in">
      {/* Header with customer basic info */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">
              {customer.name} {customer.lastName}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone size={16} />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={16} />
                <span>{customer.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-muted-foreground">Score crediticio</div>
            <div className={`text-xl font-semibold ${
              customer.creditScore >= 700 ? 'text-green-600' : 
              customer.creditScore >= 650 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {customer.creditScore}
            </div>
          </div>
        </div>
      </div>

      {/* Customer attribute cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-blue-500" />
            <div className="text-sm text-muted-foreground">Edad</div>
          </div>
          <div className="text-xl font-medium">{customer.age} años</div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={16} className="text-green-500" />
            <div className="text-sm text-muted-foreground">Ingresos</div>
          </div>
          <div className="text-xl font-medium">€{customer.income.toLocaleString()}</div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Home size={16} className="text-purple-500" />
            <div className="text-sm text-muted-foreground">Domicilio</div>
          </div>
          <div className="text-sm font-medium truncate" title={customer.address}>
            {customer.address}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-amber-500" />
            <div className="text-sm text-muted-foreground">Preferencias</div>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {customer.preferences.map((pref, i) => (
              <span key={i} className="badge badge-info text-xs">
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <TabView 
        tabs={[
          {
            id: 'profile',
            label: (
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>Perfil completo</span>
              </div>
            ),
            content: (
              <div className="space-y-6">
                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-lg font-medium mb-4">Información personal</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Nombre completo</div>
                          <div className="font-medium">{customer.name} {customer.lastName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Edad</div>
                          <div className="font-medium">{customer.age} años</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Teléfono</div>
                          <div className="font-medium">{customer.phone}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Email</div>
                          <div className="font-medium">{customer.email}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Dirección</div>
                          <div className="font-medium">{customer.address}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Ingresos anuales</div>
                          <div className="font-medium">€{customer.income.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Score crediticio</div>
                          <div className={`font-medium ${
                            customer.creditScore >= 700 ? 'text-green-600' : 
                            customer.creditScore >= 650 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {customer.creditScore} 
                            <span className="text-muted-foreground font-normal"> / 850</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Preferencias</div>
                          <div className="flex flex-wrap gap-1">
                            {customer.preferences.map((pref, i) => (
                              <span key={i} className="badge badge-info text-xs">
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-lg font-medium mb-4">Propensión a productos</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <CreditCard size={14} className="text-blue-500" />
                          <span>Tarjetas</span>
                        </div>
                        <div className="text-sm font-medium">
                          {(customer.propensity.creditCards * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-value bg-blue-500"
                          style={{ width: `${customer.propensity.creditCards * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <BanknoteIcon size={14} className="text-green-500" />
                          <span>Préstamos</span>
                        </div>
                        <div className="text-sm font-medium">
                          {(customer.propensity.loans * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-value bg-green-500"
                          style={{ width: `${customer.propensity.loans * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Shield size={14} className="text-purple-500" />
                          <span>Seguros</span>
                        </div>
                        <div className="text-sm font-medium">
                          {(customer.propensity.insurance * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-value bg-purple-500"
                          style={{ width: `${customer.propensity.insurance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <PiggyBank size={14} className="text-amber-500" />
                          <span>Ahorros</span>
                        </div>
                        <div className="text-sm font-medium">
                          {(customer.propensity.savings * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-value bg-amber-500"
                          style={{ width: `${customer.propensity.savings * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Productos recomendados</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        ...recommendedCreditCards, 
                        ...recommendedLoans, 
                        ...recommendedInsurance, 
                        ...recommendedSavings
                      ].slice(0, 3).map(product => (
                        <ProductCard key={product.id} product={product} recommended={true} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-lg font-medium mb-4">Notas de CRM</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">Cliente interesado en seguro de viaje</div>
                        <div className="text-xs text-muted-foreground">10/05/2023</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        El cliente mostró interés en seguros de viaje para sus próximas vacaciones a Estados Unidos. Comentó que viajaría en julio con su familia.
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">Consulta sobre préstamos personales</div>
                        <div className="text-xs text-muted-foreground">03/02/2023</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        El cliente consultó sobre opciones de préstamos personales para reformas en su vivienda. Se le presentaron varias alternativas pero no procedió con la contratación.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="text-primary text-sm hover:underline">
                      Ver historial completo
                    </button>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: 'products',
            label: (
              <div className="flex items-center gap-1">
                <Wallet size={16} />
                <span>Productos contratados</span>
              </div>
            ),
            content: (
              <div className="space-y-6">
                {/* Credit Cards */}
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={18} className="text-blue-500" />
                    <h3 className="text-lg font-medium">Tarjetas de crédito</h3>
                  </div>
                  
                  {creditCards.length > 0 ? (
                    <div className="space-y-4">
                      {creditCards.map(card => (
                        <div key={card.id} className="p-4 border border-border rounded-lg bg-secondary/30">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{card.name}</div>
                            <div className={`badge ${card.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                              {card.status === 'active' ? 'Activa' : 'Pendiente'}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">Número</div>
                              <div className="font-medium">**** **** **** 5678</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Saldo actual</div>
                              <div className="font-medium">€{card.balance?.toLocaleString() || '0'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Límite</div>
                              <div className="font-medium">€{card.limit?.toLocaleString() || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-secondary/20 rounded-lg">
                      <div className="text-muted-foreground">No tiene tarjetas contratadas</div>
                    </div>
                  )}
                </div>

                {/* Loans */}
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BanknoteIcon size={18} className="text-green-500" />
                    <h3 className="text-lg font-medium">Préstamos</h3>
                  </div>
                  
                  {loans.length > 0 ? (
                    <div className="space-y-4">
                      {loans.map(loan => (
                        <div key={loan.id} className="p-4 border border-border rounded-lg bg-secondary/30">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{loan.name}</div>
                            <div className={`badge ${loan.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                              {loan.status === 'active' ? 'Activo' : 'Pendiente'}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">Referencia</div>
                              <div className="font-medium">P-{loan.id.slice(0, 8)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Saldo pendiente</div>
                              <div className="font-medium">€{loan.balance?.toLocaleString() || '0'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Tasa interés</div>
                              <div className="font-medium">{loan.rate || 'N/A'}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-secondary/20 rounded-lg">
                      <div className="text-muted-foreground">No tiene préstamos contratados</div>
                    </div>
                  )}
                </div>

                {/* Insurance */}
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={18} className="text-purple-500" />
                    <h3 className="text-lg font-medium">Seguros</h3>
                  </div>
                  
                  {insurance.length > 0 ? (
                    <div className="space-y-4">
                      {insurance.map(ins => (
                        <div key={ins.id} className="p-4 border border-border rounded-lg bg-secondary/30">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{ins.name}</div>
                            <div className={`badge ${ins.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                              {ins.status === 'active' ? 'Activo' : 'Pendiente'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-secondary/20 rounded-lg">
                      <div className="text-muted-foreground">No tiene seguros contratados</div>
                    </div>
                  )}
                </div>

                {/* Savings */}
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <PiggyBank size={18} className="text-amber-500" />
                    <h3 className="text-lg font-medium">Cuentas de ahorro</h3>
                  </div>
                  
                  {savings.length > 0 ? (
                    <div className="space-y-4">
                      {savings.map(account => (
                        <div key={account.id} className="p-4 border border-border rounded-lg bg-secondary/30">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{account.name}</div>
                            <div className={`badge ${account.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                              {account.status === 'active' ? 'Activa' : 'Pendiente'}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">Número de cuenta</div>
                              <div className="font-medium">ES** **** **** **** **** 8901</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Saldo</div>
                              <div className="font-medium">€{account.balance?.toLocaleString() || '0'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-secondary/20 rounded-lg">
                      <div className="text-muted-foreground">No tiene cuentas de ahorro contratadas</div>
                    </div>
                  )}
                </div>
              </div>
            ),
          }
        ]}
      />
    </div>
  );
};

export default CustomerDetails;
