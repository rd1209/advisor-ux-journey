
import React, { useState, useEffect } from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, CreditCard, Landmark, ShieldCheck, PiggyBank } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductOfferStepProps {
  data?: any;
  onChange?: (data: any) => void;
}

const ProductOfferStep: React.FC<ProductOfferStepProps> = ({ data, onChange }) => {
  const { state } = useApplicationState();
  const customer = state.currentCustomer;
  const allProducts = state.productCatalog;
  
  const [bureauStatus, setBureauStatus] = useState<'idle' | 'checking' | 'approved' | 'rejected'>('idle');
  const [progress, setProgress] = useState(0);
  
  // Product selection and configuration
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [productType, setProductType] = useState<'creditCard' | 'loan' | 'insurance' | 'savings'>('creditCard');
  
  // Product terms
  const [formData, setFormData] = useState({
    bureauChecked: false,
    productType: 'creditCard' as 'creditCard' | 'loan' | 'insurance' | 'savings',
    productId: '',
    productName: '',
    amount: 5000,
    term: 12,
    interestRate: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    approved: false,
    crossSellProducts: [] as string[],
  });

  // Load form data if available
  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
      if (data.productType) {
        setProductType(data.productType);
      }
      if (data.productId) {
        setSelectedProduct(data.productId);
      }
      if (data.bureauChecked) {
        setBureauStatus('approved');
      }
    }
  }, [data]);

  // Update parent component
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Filter products by type
  const filteredProducts = allProducts.filter(product => product.type === productType);

  const checkCreditBureau = () => {
    setBureauStatus('checking');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate approval based on customer credit score if available
          const approved = !customer || customer.creditScore > 600;
          setBureauStatus(approved ? 'approved' : 'rejected');
          
          // Default values based on product type
          let defaultAmount = 5000;
          let defaultTerm = 12;
          let defaultRate = 0;
          
          if (productType === 'creditCard') {
            defaultAmount = 3000;
            defaultRate = 22.9;
          } else if (productType === 'loan') {
            defaultAmount = 10000;
            defaultTerm = 48;
            defaultRate = 7.5;
          } else if (productType === 'insurance') {
            defaultAmount = 500;
            defaultTerm = 12;
          } else if (productType === 'savings') {
            defaultAmount = 5000;
            defaultRate = 3.0;
          }
          
          setFormData(prev => ({ 
            ...prev, 
            bureauChecked: true,
            approved,
            amount: defaultAmount,
            term: defaultTerm,
            interestRate: defaultRate,
            // Simple calculation for monthly payment
            monthlyPayment: productType === 'savings' ? 0 : defaultAmount / defaultTerm,
            totalPayment: productType === 'savings' ? defaultAmount * (1 + defaultRate/100) : defaultAmount
          }));
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleProductSelect = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(productId);
      
      // Default values based on product
      let defaultAmount = 5000;
      let defaultTerm = 12;
      let defaultRate = 0;
      
      if (product.type === 'creditCard') {
        defaultAmount = product.limit?.min || 3000;
        defaultRate = product.interestRate?.min || 22.9;
      } else if (product.type === 'loan') {
        defaultAmount = product.limit?.min || 10000;
        defaultTerm = 48;
        defaultRate = product.interestRate?.min || 7.5;
      } else if (product.type === 'insurance') {
        defaultAmount = 500;
        defaultTerm = 12;
      } else if (product.type === 'savings') {
        defaultAmount = 5000;
        defaultRate = product.interestRate?.min || 3.0;
      }
      
      setFormData(prev => ({ 
        ...prev,
        productId: productId,
        productType: product.type,
        productName: product.name,
        amount: defaultAmount,
        term: defaultTerm,
        interestRate: defaultRate,
        // Simple calculation for monthly payment
        monthlyPayment: product.type === 'savings' ? 0 : defaultAmount / defaultTerm,
        totalPayment: product.type === 'savings' ? defaultAmount * (1 + defaultRate/100) : defaultAmount
      }));
    }
  };

  const handleAmountChange = (amount: number) => {
    setFormData(prev => {
      const newAmount = amount;
      // Recalculate payments based on the product type
      let monthlyPayment = 0;
      let totalPayment = 0;
      
      if (prev.productType === 'creditCard' || prev.productType === 'loan') {
        const monthlyRate = prev.interestRate / 100 / 12;
        monthlyPayment = (newAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -prev.term));
        totalPayment = monthlyPayment * prev.term;
      } else if (prev.productType === 'insurance') {
        monthlyPayment = newAmount / 12;
        totalPayment = newAmount;
      } else if (prev.productType === 'savings') {
        const annualRate = prev.interestRate / 100;
        const years = prev.term / 12;
        totalPayment = newAmount * (1 + annualRate * years);
      }
      
      return {
        ...prev,
        amount: newAmount,
        monthlyPayment,
        totalPayment
      };
    });
  };

  const handleTermChange = (term: number) => {
    setFormData(prev => {
      // Recalculate payments based on the new term
      let monthlyPayment = 0;
      let totalPayment = 0;
      
      if (prev.productType === 'creditCard' || prev.productType === 'loan') {
        const monthlyRate = prev.interestRate / 100 / 12;
        monthlyPayment = (prev.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
        totalPayment = monthlyPayment * term;
      } else if (prev.productType === 'insurance') {
        monthlyPayment = prev.amount / 12;
        totalPayment = prev.amount;
      } else if (prev.productType === 'savings') {
        const annualRate = prev.interestRate / 100;
        const years = term / 12;
        totalPayment = prev.amount * (1 + annualRate * years);
      }
      
      return {
        ...prev,
        term,
        monthlyPayment,
        totalPayment
      };
    });
  };

  const handleRateChange = (rate: number) => {
    setFormData(prev => {
      // Recalculate payments based on the new rate
      let monthlyPayment = 0;
      let totalPayment = 0;
      
      if (prev.productType === 'creditCard' || prev.productType === 'loan') {
        const monthlyRate = rate / 100 / 12;
        monthlyPayment = (prev.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -prev.term));
        totalPayment = monthlyPayment * prev.term;
      } else if (prev.productType === 'insurance') {
        monthlyPayment = prev.amount / 12;
        totalPayment = prev.amount;
      } else if (prev.productType === 'savings') {
        const annualRate = rate / 100;
        const years = prev.term / 12;
        totalPayment = prev.amount * (1 + annualRate * years);
      }
      
      return {
        ...prev,
        interestRate: rate,
        monthlyPayment,
        totalPayment
      };
    });
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'creditCard': return <CreditCard className="h-5 w-5" />;
      case 'loan': return <Landmark className="h-5 w-5" />;
      case 'insurance': return <ShieldCheck className="h-5 w-5" />;
      case 'savings': return <PiggyBank className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {bureauStatus === 'idle' && (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-4">Consulta al buró de crédito</h3>
          <p className="text-muted-foreground mb-6">
            Para continuar con la oferta del producto, necesitamos consultar el buró de crédito.
          </p>
          <Button onClick={checkCreditBureau}>Consultar buró de crédito</Button>
        </div>
      )}

      {bureauStatus === 'checking' && (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-4">Consultando buró de crédito</h3>
          <Progress value={progress} className="mb-4" />
          <p className="text-muted-foreground">Por favor espere mientras obtenemos la información...</p>
        </div>
      )}

      {bureauStatus === 'rejected' && (
        <Alert className="bg-red-50 border-red-200 mb-6">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            Lo sentimos, no es posible ofrecer un producto en este momento. Por favor, intente más tarde.
          </AlertDescription>
        </Alert>
      )}

      {bureauStatus === 'approved' && (
        <div className="space-y-6">
          <Alert className="bg-green-50 border-green-200 mb-6">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Buró de crédito consultado correctamente. Puede continuar seleccionando un producto.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue={productType} className="w-full" onValueChange={(value) => setProductType(value as any)}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="creditCard" className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Tarjetas
              </TabsTrigger>
              <TabsTrigger value="loan" className="flex-1">
                <Landmark className="mr-2 h-4 w-4" />
                Préstamos
              </TabsTrigger>
              <TabsTrigger value="insurance" className="flex-1">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Seguros
              </TabsTrigger>
              <TabsTrigger value="savings" className="flex-1">
                <PiggyBank className="mr-2 h-4 w-4" />
                Ahorro
              </TabsTrigger>
            </TabsList>

            {['creditCard', 'loan', 'insurance', 'savings'].map((type) => (
              <TabsContent key={type} value={type} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map(product => (
                    <Card 
                      key={product.id} 
                      className={`cursor-pointer overflow-hidden transition-all ${selectedProduct === product.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getProductIcon(product.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                            
                            {product.interestRate && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Tasa desde:</span> {product.interestRate.min}%
                              </div>
                            )}
                            
                            {product.limit && (
                              <div className="mt-1 text-sm">
                                <span className="font-medium">Límite:</span> {product.limit.min}€ - {product.limit.max}€
                              </div>
                            )}
                            
                            {selectedProduct === product.id && (
                              <div className="mt-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 inline-block mr-1" />
                                <span className="text-sm text-green-600">Producto seleccionado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {selectedProduct && (
            <div className="border rounded-lg p-6 space-y-6 bg-card">
              <h3 className="text-lg font-medium">Configuración del producto</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto (€)</Label>
                  <div className="flex gap-4">
                    <Slider
                      id="amount"
                      defaultValue={[formData.amount]}
                      min={formData.productType === 'creditCard' ? 1000 : 3000}
                      max={formData.productType === 'creditCard' ? 30000 : 50000}
                      step={formData.productType === 'creditCard' ? 500 : 1000}
                      onValueChange={(value) => handleAmountChange(value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleAmountChange(parseInt(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
                
                {formData.productType !== 'insurance' && (
                  <div className="space-y-2">
                    <Label htmlFor="term">Plazo (meses)</Label>
                    <div className="flex gap-4">
                      <Slider
                        id="term"
                        defaultValue={[formData.term]}
                        min={formData.productType === 'creditCard' ? 6 : 12}
                        max={formData.productType === 'creditCard' ? 36 : 120}
                        step={formData.productType === 'creditCard' ? 6 : 12}
                        onValueChange={(value) => handleTermChange(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={formData.term}
                        onChange={(e) => handleTermChange(parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {(formData.term / 12).toFixed(1)} años
                    </p>
                  </div>
                )}
                
                {(formData.productType === 'creditCard' || formData.productType === 'loan') && (
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Tasa de interés (%)</Label>
                    <div className="flex gap-4">
                      <Slider
                        id="interestRate"
                        defaultValue={[formData.interestRate]}
                        min={formData.productType === 'creditCard' ? 16 : 4}
                        max={formData.productType === 'creditCard' ? 26 : 15}
                        step={0.5}
                        onValueChange={(value) => handleRateChange(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={formData.interestRate.toFixed(2)}
                        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                        className="w-24"
                        step="0.1"
                      />
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-primary/5 rounded-lg border mt-4">
                  <h4 className="font-medium mb-3">Resultados:</h4>
                  <div className="space-y-2">
                    {formData.monthlyPayment > 0 && formData.productType !== 'savings' && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cuota mensual:</span>
                        <span className="font-medium">{formData.monthlyPayment.toFixed(2)}€</span>
                      </div>
                    )}
                    {formData.totalPayment > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {formData.productType === 'savings' ? 'Monto final:' : 'Total a pagar:'}
                        </span>
                        <span className="font-medium">{formData.totalPayment.toFixed(2)}€</span>
                      </div>
                    )}
                    {formData.interestRate > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tasa de interés:</span>
                        <span className="font-medium">{formData.interestRate.toFixed(2)}%</span>
                      </div>
                    )}
                    {formData.term > 0 && formData.productType !== 'insurance' && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Plazo:</span>
                        <span className="font-medium">{formData.term} meses</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4">
                  <h4 className="font-medium flex items-center text-amber-800">
                    <span>🎁</span>
                    <span className="ml-2">Beneficios adicionales</span>
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {formData.productType === 'creditCard' && (
                      <>
                        <li className="text-sm text-amber-700">• Seguro de compra gratuito en los primeros 6 meses</li>
                        <li className="text-sm text-amber-700">• Puntos dobles en todas las compras del primer mes</li>
                      </>
                    )}
                    {formData.productType === 'loan' && (
                      <>
                        <li className="text-sm text-amber-700">• 0,5% de descuento en la tasa al contratar un seguro</li>
                        <li className="text-sm text-amber-700">• Sin comisiones por cancelación anticipada</li>
                      </>
                    )}
                    {formData.productType === 'insurance' && (
                      <>
                        <li className="text-sm text-amber-700">• 10% de descuento al contratar online</li>
                        <li className="text-sm text-amber-700">• Cobertura adicional sin costo el primer año</li>
                      </>
                    )}
                    {formData.productType === 'savings' && (
                      <>
                        <li className="text-sm text-amber-700">• +0,25% de rendimiento al vincular una nómina</li>
                        <li className="text-sm text-amber-700">• Tarjeta de débito sin comisiones</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductOfferStep;
