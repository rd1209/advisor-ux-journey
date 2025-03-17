
import React, { useState, useEffect } from 'react';
import { useApplicationState } from '@/hooks/useApplicationState';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, User, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PersonalInfoStepProps {
  data?: any;
  onChange?: (data: any) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange }) => {
  const { state } = useApplicationState();
  const customer = state.currentCustomer;
  
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    income: customer?.income?.toString() || '',
    additionalNotes: '',
  });

  // Update parent component's data when form changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Initialize with passed data if available
  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.name && formData.lastName && formData.email && formData.phone;
  };

  return (
    <div className="space-y-6">
      {customer ? (
        <Alert className="bg-green-50 border-green-200 mb-6">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Información pre-llenada del cliente actual
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-amber-50 border-amber-200 mb-6">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            No hay cliente activo. Por favor complete manualmente la información.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Ingrese nombre" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            placeholder="Ingrese apellidos" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="ejemplo@correo.com" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="+34 XXX XXX XXX" 
            required 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="Dirección completa" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="income">Ingresos anuales (€)</Label>
          <Input 
            id="income" 
            name="income" 
            type="number" 
            value={formData.income} 
            onChange={handleChange} 
            placeholder="0" 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="additionalNotes">Notas adicionales</Label>
          <Textarea 
            id="additionalNotes" 
            name="additionalNotes" 
            value={formData.additionalNotes} 
            onChange={handleChange} 
            placeholder="Información adicional relevante para el proceso de contratación" 
            rows={3} 
          />
        </div>
      </div>

      {!isFormValid() && (
        <Alert className="bg-red-50 border-red-200 mt-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            Por favor complete los campos obligatorios
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PersonalInfoStep;
