import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageCircle, X, Minimize2 } from "lucide-react";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface FloatingChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
}

export default function FloatingChatWidget({ 
  position = 'bottom-right',
  primaryColor = '#f3202e'
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  // Fetch or create conversation
  const { data: conversations } = useQuery({
    queryKey: ['/api/conversations'],
    enabled: isOpen,
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Chatbot Conversation',
          userId: 1
        })
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    }
  });

  // Initialize conversation when widget opens
  useEffect(() => {
    if (isOpen && !currentConversationId) {
      if (conversations && conversations.length > 0) {
        setCurrentConversationId(conversations[0].id);
      } else {
        createConversationMutation.mutate();
      }
    }
  }, [isOpen, conversations, currentConversationId]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat Widget */}
      {isOpen && (
        <Card 
          className={`mb-4 w-80 shadow-2xl border-0 transition-all duration-300 floating-widget-enter ${
            isMinimized ? 'h-12' : 'h-96'
          }`}
          style={{ borderTop: `4px solid ${primaryColor}` }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-3 text-white rounded-t-lg cursor-pointer"
            style={{ backgroundColor: primaryColor }}
            onClick={isMinimized ? maximizeChat : undefined}
          >
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-medium text-sm">AI Assistant</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeChat();
                }}
              >
                <Minimize2 size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <X size={12} />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <CardContent className="p-0 h-full flex flex-col">
              {currentConversationId ? (
                <>
                  <div className="flex-1 overflow-hidden">
                    <ChatMessages conversationId={currentConversationId} />
                  </div>
                  <div className="border-t p-3">
                    <ChatInput conversationId={currentConversationId} />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4 text-center">
                  <div>
                    <Bot className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600">
                      Starting conversation...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </Button>


    </div>
  );
}