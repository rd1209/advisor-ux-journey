
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface MultiStepFormProps {
  steps: {
    id: string;
    title: string;
    description: string;
    content: React.ReactNode;
  }[];
  onComplete?: (data: any) => void;
  className?: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  onComplete,
  className,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setCompleted(true);
      onComplete?.(formData);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
  };

  const handleUpdateData = (stepId: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: data,
    }));
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    index === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : index < currentStepIndex
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentStepIndex ? (
                    <Check size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-1 w-10",
                      index < currentStepIndex
                        ? "bg-green-500"
                        : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium">{currentStep.title}</h2>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </div>
      </div>

      <div className="min-h-[300px] animate-fade-in">
        {React.cloneElement(currentStep.content as React.ReactElement, {
          data: formData[currentStep.id],
          onChange: (data: any) => handleUpdateData(currentStep.id, data),
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevious}
          className={cn(
            "px-4 py-2 rounded-md flex items-center gap-1 transition-colors",
            isFirstStep
              ? "text-muted-foreground cursor-not-allowed"
              : "text-foreground hover:bg-muted"
          )}
          disabled={isFirstStep}
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </button>
        <button
          onClick={handleNext}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-1 hover:bg-primary/90 transition-colors button-shine"
        >
          <span>{isLastStep ? "Completar" : "Siguiente"}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;
