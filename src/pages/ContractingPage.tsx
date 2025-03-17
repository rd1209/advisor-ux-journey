
import React from 'react';
import MultiStepForm from '@/components/MultiStepForm';
import { useApplicationState } from '@/hooks/useApplicationState';
import PersonalInfoStep from '@/components/contracting/PersonalInfoStep';
import IdentityVerificationStep from '@/components/contracting/IdentityVerificationStep';
import ProductOfferStep from '@/components/contracting/ProductOfferStep';
import ConfirmationStep from '@/components/contracting/ConfirmationStep';
import { toast } from 'sonner';

const ContractingPage = () => {
  const { state } = useApplicationState();
  
  const handleComplete = (data: any) => {
    console.log('Contract completed with data:', data);
    toast.success('Contrato completado con éxito', {
      description: 'El contrato ha sido procesado correctamente'
    });
  };

  return (
    <div className="px-6 py-6 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">Contratación Online</h1>
      <div className="glass-card p-6 rounded-xl">
        <MultiStepForm
          onComplete={handleComplete}
          steps={[
            {
              id: 'personal-info',
              title: 'Información personal',
              description: 'Verifica y completa la información del cliente',
              content: <PersonalInfoStep />,
            },
            {
              id: 'identity-verification',
              title: 'Verificación de identidad',
              description: 'Verifica la identidad del cliente',
              content: <IdentityVerificationStep />,
            },
            {
              id: 'product-offer',
              title: 'Oferta de producto',
              description: 'Consulta al buró de crédito y presenta oferta',
              content: <ProductOfferStep />,
            },
            {
              id: 'confirmation',
              title: 'Confirmación',
              description: 'Confirma los detalles del contrato',
              content: <ConfirmationStep />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ContractingPage;
