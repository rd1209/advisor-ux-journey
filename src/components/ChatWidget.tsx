
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, MessageSquare, X, RefreshCw, Loader2 } from "lucide-react";

type Message = { sender: "user" | "ai"; text: string };

const BOT_WELCOME =
  "Hola, soy tu asistente virtual. ¿En qué puedo ayudarte con información de productos?";

const webhookUrl =
  "https://prueba-rd-n8.app.n8n.cloud/webhook-test/flujo-callcenter";

export const ChatWidget: React.FC = () => {
  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. On mount: generate/read chatSessionId (persist in localStorage)
  useEffect(() => {
    let id = localStorage.getItem("chatSessionId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("chatSessionId", id);
    }
    setSessionId(id);
  }, []);

  // 2. Scroll to last message on change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Open/close the chat. Add welcome if just opened and no messages.
  const toggleChat = () => {
    setIsOpen((prev) => {
      const nowOpen = !prev;
      if (nowOpen && messages.length === 0) {
        setMessages([{ sender: "ai", text: BOT_WELCOME }]);
      }
      return nowOpen;
    });
  };

  // 4. Handle message send
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message immediately
    const nextMessages = [...messages, { sender: "user", text: inputValue }];
    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          sessionId,
        }),
      });

      let botText = "Lo siento, no pude procesar tu solicitud.";

      // Try to handle both objects and arrays in the response
      if (response.ok) {
        const data = await response.json();
        const extract = (obj: any): string | undefined =>
          obj?.output || obj?.reply || obj?.message;

        if (Array.isArray(data)) {
          for (const item of data) {
            const txt = extract(item);
            if (txt) {
              botText = txt;
              break;
            }
          }
        } else {
          const txt = extract(data);
          if (txt) botText = txt;
        }
      } else {
        // Network error (non-2xx)
        throw new Error(`Status: ${response.status}`);
      }

      setMessages((msgs) => [...msgs, { sender: "ai", text: botText }]);
    } catch (err) {
      console.error("Webhook/chat error:", err);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text:
            "Lo siento, hubo un problema al conectar. Intenta de nuevo.",
        },
      ]);
      setError("Problema de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5a. Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setInputValue(e.target.value);

  // 5b. Enter key: send (no Shift+Enter)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault?.();
      handleSend();
    }
  };

  // Helper: Clear chat (add only welcome message)
  const clearChat = () => {
    setMessages([{ sender: "ai", text: BOT_WELCOME }]);
    setError(null);
  };

  // Closed state: just the floating button to open
  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 z-50"
        size="icon"
        title="Abrir chat"
      >
        <MessageSquare size={28} />
      </Button>
    );
  }

  // Open state: window with chat and input
  return (
    <div className="glass-card shadow-md fixed bottom-4 right-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col z-50 bg-background border border-input rounded-xl">
      {/* Header */}
      <div className="flex flex-row items-center justify-between px-4 py-3 border-b">
        <div>
          <span className="flex items-center gap-2 text-xl font-semibold">
            <Bot className="text-primary" size={20} />
            Asistente
            {sessionId && (
              <span className="text-xs text-muted-foreground ml-2">
                {sessionId.substring(0, 6)}...
              </span>
            )}
          </span>
          <div className="text-xs text-muted-foreground">
            Pregunta sobre productos y servicios
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleChat}
          className="h-8 w-8 rounded-full"
        >
          <X size={18} />
        </Button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-background">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {/* Loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
              <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Footer: input */}
      <div className="border-t px-4 py-3 flex gap-2 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={clearChat}
          title="Limpiar chat"
        >
          <RefreshCw size={16} />
        </Button>
        <Input
          className="flex-1"
          placeholder="Escribe tu pregunta..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
        >
          <Send size={16} />
        </Button>
      </div>
      {/* Error message (if any) */}
      {error && (
        <div className="px-4 pb-2 text-xs text-red-500">{error}</div>
      )}
    </div>
  );
};

export default ChatWidget;
