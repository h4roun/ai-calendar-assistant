import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import MessageBubble from "./message-bubble";
import TypingIndicator from "./typing-indicator";

interface Message {
  id: number;
  conversationId: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: any;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
}

export default function ChatMessages({ messages, isLoading, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 p-6 chat-messages">

      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 max-w-md message-appear">
              <p className="text-gray-800 text-sm leading-relaxed">
                Hello! I'm your AI appointment assistant. I can help you schedule medical appointments in your Google Calendar. 
                Just describe your appointment and I'll take care of the rest!
              </p>
              <span className="text-xs text-gray-500 mt-2 block">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
