
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScanFace, FileCheck, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IdentityVerificationStepProps {
  data?: any;
  onChange?: (data: any) => void;
}

const IdentityVerificationStep: React.FC<IdentityVerificationStepProps> = ({ data, onChange }) => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [documentType, setDocumentType] = useState<'dni' | 'passport' | 'other'>('dni');
  const [documentNumber, setDocumentNumber] = useState('');
  
  // Process verification data
  const [formData, setFormData] = useState({
    isVerified: false,
    verificationMethod: 'document',
    documentType: 'dni',
    documentNumber: '',
    documentImage: null as File | null,
  });

  // Initialize with passed data if available
  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
      if (data.documentType) {
        setDocumentType(data.documentType);
      }
      if (data.documentNumber) {
        setDocumentNumber(data.documentNumber);
      }
      if (data.isVerified) {
        setVerificationStatus('success');
      }
    }
  }, [data]);

  // Update parent component's data when form changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(e.target.value);
    setFormData(prev => ({ ...prev, documentNumber: e.target.value }));
  };

  const handleDocumentTypeChange = (type: 'dni' | 'passport' | 'other') => {
    setDocumentType(type);
    setFormData(prev => ({ ...prev, documentType: type }));
  };

  const handleVerification = () => {
    // Simulate verification process
    setVerificationStatus('scanning');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setVerificationStatus('success');
          setFormData(prev => ({ ...prev, isVerified: true }));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FileCheck size={24} className="text-primary" />
              <h3 className="text-lg font-medium">Verificación por documento</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de documento</Label>
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant={documentType === 'dni' ? 'default' : 'outline'} 
                    onClick={() => handleDocumentTypeChange('dni')}
                    className="flex-1"
                  >
                    DNI
                  </Button>
                  <Button 
                    type="button" 
                    variant={documentType === 'passport' ? 'default' : 'outline'} 
                    onClick={() => handleDocumentTypeChange('passport')}
                    className="flex-1"
                  >
                    Pasaporte
                  </Button>
                  <Button 
                    type="button" 
                    variant={documentType === 'other' ? 'default' : 'outline'} 
                    onClick={() => handleDocumentTypeChange('other')}
                    className="flex-1"
                  >
                    Otro
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de documento</Label>
                <Input 
                  id="documentNumber" 
                  value={documentNumber} 
                  onChange={handleDocumentNumberChange} 
                  placeholder="Ingrese el número del documento" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentFile">Subir documento</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Arrastre o haga clic para subir
                  </p>
                  <input
                    id="documentFile"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData(prev => ({ 
                          ...prev, 
                          documentImage: e.target.files![0] 
                        }));
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-2" 
                    onClick={() => document.getElementById('documentFile')?.click()}
                  >
                    Seleccionar archivo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="p-4">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ScanFace size={24} className="text-primary" />
              <h3 className="text-lg font-medium">Verificación facial</h3>
            </div>
            
            <div className="rounded-md border bg-muted/30 aspect-video flex flex-col items-center justify-center">
              {verificationStatus === 'scanning' ? (
                <div className="text-center space-y-4 p-6 w-full">
                  <ScanFace size={48} className="mx-auto text-primary animate-pulse" />
                  <p>Escaneando...</p>
                  <Progress value={progress} className="w-full" />
                </div>
              ) : verificationStatus === 'success' ? (
                <div className="text-center space-y-4">
                  <CheckCircle2 size={48} className="mx-auto text-green-500" />
                  <p className="text-green-700 font-medium">Verificación exitosa</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <ScanFace size={48} className="mx-auto text-gray-400" />
                  <p className="text-gray-500">Preparado para verificación</p>
                </div>
              )}
            </div>
            
            <Button 
              type="button" 
              className="w-full" 
              disabled={verificationStatus === 'scanning' || verificationStatus === 'success' || !documentNumber} 
              onClick={handleVerification}
            >
              {verificationStatus === 'success' ? 'Verificado' : 'Iniciar verificación'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              La verificación facial es segura y se utiliza solo para confirmar su identidad.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {verificationStatus === 'success' ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Identidad verificada correctamente
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            La verificación de identidad es necesaria para continuar
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default IdentityVerificationStep;
