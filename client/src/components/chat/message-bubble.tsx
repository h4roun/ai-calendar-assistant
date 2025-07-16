import { Bot, User } from "lucide-react";
import AppointmentCard from "./appointment-card";

interface Message {
  id: number;
  conversationId: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: any;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  if (message.role === 'user') {
    return (
      <div className="flex items-start space-x-3 justify-end message-appear">
        <div className="bg-primary rounded-2xl rounded-tr-md p-4 max-w-xs">
          <p className="text-white text-sm leading-relaxed">
            {message.content}
          </p>
          <span className="text-xs text-blue-200 mt-2 block">{timestamp}</span>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="text-gray-600" size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 message-appear">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="text-white" size={16} />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 max-w-md">
        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        
        {message.metadata?.appointmentId && (
          <AppointmentCard appointmentId={message.metadata.appointmentId} />
        )}
        
        <span className="text-xs text-gray-500 mt-2 block">{timestamp}</span>
      </div>
    </div>
  );
}
