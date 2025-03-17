
import React, { useState, useEffect } from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  CreditCard, 
  Landmark, 
  ShieldCheck, 
  PiggyBank,
  FileText,
  Mail
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConfirmationStepProps {
  data?: any;
  onChange?: (data: any) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ data, onChange }) => {
  const { state } = useApplicationState();
  const customer = state.currentCustomer;
  
  const [formData, setFormData] = useState({
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
    confirmed: false,
    contractSent: false,
    contractEmail: customer?.email || '',
  });
  
  // Get product information from previous steps
  const [productInfo, setProductInfo] = useState<{
    personalInfo?: any;
    identityVerification?: any;
    productOffer?: any;
  }>({});

  useEffect(() => {
    // Initialize with passed data if available
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  // Update parent component's data when form changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Set product info from previous steps
  useEffect(() => {
    const parentData = {
      personalInfo: data?.personalInfo,
      identityVerification: data?.identityVerification,
      productOffer: data?.productOffer
    };
    setProductInfo(parentData);
  }, [data]);

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleConfirm = () => {
    setFormData(prev => ({ 
      ...prev, 
      confirmed: true,
      contractSent: true
    }));
  };

  const getProductIcon = (type?: string) => {
    switch (type) {
      case 'creditCard': return <CreditCard className="h-5 w-5" />;
      case 'loan': return <Landmark className="h-5 w-5" />;
      case 'insurance': return <ShieldCheck className="h-5 w-5" />;
      case 'savings': return <PiggyBank className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '0,00 €';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const isComplete = formData.agreeTerms && formData.agreePrivacy;
  
  return (
    <div className="space-y-6">
      {!formData.confirmed ? (
        <>
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resumen del contrato
                </h3>
                
                {/* Client Information */}
                <div className="mb-6 border-b pb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Información del cliente</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{productInfo?.personalInfo?.name} {productInfo?.personalInfo?.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p className="font-medium">{productInfo?.personalInfo?.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Teléfono:</span>
                      <p className="font-medium">{productInfo?.personalInfo?.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Dirección:</span>
                      <p className="font-medium">{productInfo?.personalInfo?.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Document Information */}
                <div className="mb-6 border-b pb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Documento de identidad</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Tipo de documento:</span>
                      <p className="font-medium capitalize">{productInfo?.identityVerification?.documentType || 'DNI'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Número de documento:</span>
                      <p className="font-medium">{productInfo?.identityVerification?.documentNumber || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-muted-foreground">Estado de verificación:</span>
                      <p className="font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Verificado
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Product Information */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Producto contratado</h4>
                  
                  <div className="p-4 bg-primary/5 rounded-lg border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getProductIcon(productInfo?.productOffer?.productType)}
                      </div>
                      <div>
                        <h5 className="font-medium">{productInfo?.productOffer?.productName || 'Producto seleccionado'}</h5>
                        <p className="text-sm text-muted-foreground capitalize">
                          {productInfo?.productOffer?.productType === 'creditCard' && 'Tarjeta de crédito'}
                          {productInfo?.productOffer?.productType === 'loan' && 'Préstamo personal'}
                          {productInfo?.productOffer?.productType === 'insurance' && 'Seguro'}
                          {productInfo?.productOffer?.productType === 'savings' && 'Cuenta de ahorro'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {/* Amount */}
                      <div>
                        <span className="text-sm text-muted-foreground">Monto:</span>
                        <p className="font-medium">{formatCurrency(productInfo?.productOffer?.amount)}</p>
                      </div>
                      
                      {/* Term */}
                      {productInfo?.productOffer?.term && (
                        <div>
                          <span className="text-sm text-muted-foreground">Plazo:</span>
                          <p className="font-medium">{productInfo?.productOffer?.term} meses</p>
                        </div>
                      )}
                      
                      {/* Interest Rate */}
                      {productInfo?.productOffer?.interestRate > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Tasa de interés:</span>
                          <p className="font-medium">{productInfo?.productOffer?.interestRate}%</p>
                        </div>
                      )}
                      
                      {/* Monthly Payment */}
                      {productInfo?.productOffer?.monthlyPayment > 0 && productInfo?.productOffer?.productType !== 'savings' && (
                        <div>
                          <span className="text-sm text-muted-foreground">Cuota mensual:</span>
                          <p className="font-medium">{formatCurrency(productInfo?.productOffer?.monthlyPayment)}</p>
                        </div>
                      )}
                      
                      {/* Total Payment */}
                      {productInfo?.productOffer?.totalPayment > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">
                            {productInfo?.productOffer?.productType === 'savings' ? 'Monto final:' : 'Total a pagar:'}
                          </span>
                          <p className="font-medium">{formatCurrency(productInfo?.productOffer?.totalPayment)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeTerms} 
                  onCheckedChange={() => handleCheckboxChange('agreeTerms')}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto los términos y condiciones
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    He leído y acepto los términos y condiciones del contrato.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={formData.agreePrivacy} 
                  onCheckedChange={() => handleCheckboxChange('agreePrivacy')}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto la política de privacidad
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    He leído y acepto la política de privacidad y el tratamiento de mis datos personales.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="marketing" 
                  checked={formData.agreeMarketing} 
                  onCheckedChange={() => handleCheckboxChange('agreeMarketing')}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="marketing"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto recibir comunicaciones comerciales
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Acepto recibir ofertas personalizadas y comunicaciones de marketing.
                  </p>
                </div>
              </div>
            </div>
            
            {!isComplete && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription>
                  Por favor acepte los términos y condiciones y la política de privacidad para continuar.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              className="w-full button-shine"
              disabled={!isComplete}
              onClick={handleConfirm}
            >
              Confirmar y enviar contrato
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 size={60} className="text-green-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-green-700">¡Contrato completado con éxito!</h3>
          
          <p className="text-muted-foreground mb-6">
            El contrato ha sido procesado correctamente. Hemos enviado una copia del contrato a 
            {' '}<span className="font-medium">{productInfo?.personalInfo?.email}</span>.
          </p>
          
          <div className="flex justify-center mb-6">
            <Card className="max-w-md w-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Contrato enviado</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  El cliente recibirá el contrato para revisión y firma electrónica.
                </p>
                <div className="bg-muted/40 p-2 rounded text-sm">
                  <span className="font-medium">Referencia:</span> {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline">Ver detalles</Button>
            <Button>Volver al inicio</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationStep;
