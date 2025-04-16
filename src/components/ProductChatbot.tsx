
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
import { Bot, Send, RefreshCw, Loader2, MessageSquare, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ProductChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Updated webhook URL
  const webhookUrl = "https://prueba-rd-n8.app.n8n.cloud/webhook/flujo-callcenter";
  
  const welcomeMessage: Message = {
    id: '1',
    content: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte con información de productos?',
    sender: 'bot',
    timestamp: new Date(),
  };

  // Initialize chat session ID on component mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chat_session_id');
    if (storedSessionId) {
      setChatSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('chat_session_id', newSessionId);
      setChatSessionId(newSessionId);
    }
  }, []);

  // Auto scroll to the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen(prevIsOpen => {
      const newIsOpen = !prevIsOpen;
      
      // Add welcome message if opening chat and no messages exist
      if (newIsOpen && messages.length === 0) {
        setMessages([welcomeMessage]);
      }
      
      return newIsOpen;
    });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Handle sending messages to webhook
  const handleSend = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          timestamp: new Date().toISOString(),
          source: 'chatbot',
          sessionId: chatSessionId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      // Extract bot response from any of these common field names
      const botResponseText = responseData.output || responseData.reply || 
                            responseData.message || responseData.response || 
                            'Lo siento, no pude entender tu mensaje.';
      
      const botMessage: Message = {
        id: uuidv4(),
        content: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Error de conexión. No se pudo enviar el mensaje.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el asistente. Inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setMessages([welcomeMessage]);
  };

  // If chat is closed, just show the chat button
  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full h-14 w-14"
        size="icon"
      >
        <MessageSquare size={24} />
      </Button>
    );
  }

  return (
    <Card className="glass-card shadow-md fixed bottom-4 right-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col z-50">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bot className="text-primary" size={20} />
            Asistente
            {chatSessionId && (
              <span className="text-xs text-muted-foreground ml-2">
                {chatSessionId.substring(0, 6)}...
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Pregunta sobre productos y servicios
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 rounded-full">
          <X size={18} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-4">
        <ScrollArea className="h-full pr-4">
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
        </ScrollArea>
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
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={input.trim() === '' || isLoading}>
            <Send size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
