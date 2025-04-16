
import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSessionId } from "@/hooks/useSessionId";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ProductChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte con información de productos?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sessionId } = useSessionId();
  
  // N8n webhook URL
  const webhookUrl = "https://prueba-rd-n8.app.n8n.cloud/webhook-test/flujo-callcenter";

  // Handle sending messages to n8n webhook
  const sendMessageToWebhook = async (message: string) => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          source: 'chatbot',
          sessionId: sessionId
        }),
      });
      
      if (!response.ok) {
        console.error('Webhook error:', response.status);
        return null;
      }
      
      const responseData = await response.json();
      return responseData.response || null;
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el asistente. Inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Mock response generator as fallback
  const generateResponse = (query: string): string => {
    // This is a mock response generator - in a real app, you would call an AI API
    const responses = [
      "Las tarjetas de crédito Platinum ofrecen acceso a salas VIP en aeropuertos internacionales y seguro de viaje gratuito.",
      "Nuestros préstamos personales tienen una tasa desde 6.95% TIN y plazos de hasta 8 años.",
      "El seguro de vida cubre fallecimiento, invalidez y ofrece indemnización por enfermedades graves.",
      "Las cuentas de ahorro tienen una rentabilidad del 3% TAE el primer año, sin comisiones de mantenimiento.",
      "Al contratar una tarjeta con un préstamo, el cliente obtiene una reducción de 0.25% en la tasa de interés del préstamo.",
      "Sí, todas nuestras tarjetas de crédito permiten aplazar pagos. Las condiciones dependen del tipo de tarjeta.",
      "Los requisitos principales para un préstamo son: ingresos demostrables, historial crediticio favorable y ser mayor de edad.",
      "El seguro de hogar cubre daños estructurales, robo, incendios y responsabilidad civil, con asistencia 24/7.",
    ];
    
    // Simple keyword matching for demonstration purposes
    if (query.toLowerCase().includes('tarjeta')) {
      return responses[0];
    } else if (query.toLowerCase().includes('prestamo') || query.toLowerCase().includes('préstamo')) {
      return responses[1];
    } else if (query.toLowerCase().includes('seguro')) {
      return responses[2];
    } else if (query.toLowerCase().includes('ahorro') || query.toLowerCase().includes('cuenta')) {
      return responses[3];
    } else if (query.toLowerCase().includes('beneficio') || query.toLowerCase().includes('ventaja')) {
      return responses[4];
    } else if (query.toLowerCase().includes('aplazar') || query.toLowerCase().includes('pago')) {
      return responses[5];
    } else if (query.toLowerCase().includes('requisito')) {
      return responses[6];
    } else if (query.toLowerCase().includes('hogar')) {
      return responses[7];
    } else {
      return "Lo siento, no tengo información específica sobre eso. ¿Puedes reformular tu pregunta o preguntar sobre tarjetas, préstamos, seguros o cuentas de ahorro?";
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Try to get response from webhook
    const webhookResponse = await sendMessageToWebhook(input);
    
    setTimeout(() => {
      let responseText = webhookResponse;
      
      // If webhook failed, use the mock response as fallback
      if (!responseText) {
        responseText = generateResponse(input);
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte con información de productos?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Auto scroll to the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="glass-card shadow-md h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bot className="text-primary" size={20} />
          Asistente de Productos
          {sessionId && (
            <span className="text-xs text-muted-foreground ml-2">
              ID: {sessionId.substring(0, 8)}...
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Pregunta sobre características y beneficios
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={clearChat}
            title="Limpiar chat"
          >
            <RefreshCw size={16} />
          </Button>
          <Input
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={input.trim() === '' || isLoading}>
            <Send size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
