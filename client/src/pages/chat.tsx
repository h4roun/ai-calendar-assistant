import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  conversationId: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: any;
}

interface Conversation {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function Chat() {
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get or create initial conversation
  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations']
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/conversations', currentConversationId, 'messages'],
    enabled: !!currentConversationId
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/conversations', {
        title: 'New Chat'
      });
      return response.json();
    },
    onSuccess: (conversation) => {
      setCurrentConversationId(conversation.id);
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentConversationId) throw new Error('No conversation selected');
      
      const response = await apiRequest('POST', `/api/conversations/${currentConversationId}/messages`, {
        content
      });
      return response.json();
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations', currentConversationId, 'messages'] 
      });
      
      if (data.appointmentCreated) {
        toast({
          title: "Calendar Event Created!",
          description: "Your appointment has been added to Google Calendar",
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsTyping(false);
    }
  });

  // Initialize conversation on first load
  useEffect(() => {
    if (conversations && conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    } else if (conversations && conversations.length === 0 && !createConversationMutation.isPending) {
      createConversationMutation.mutate();
    }
  }, [conversations, currentConversationId, createConversationMutation]);

  const handleSendMessage = (content: string) => {
    if (!currentConversationId) {
      createConversationMutation.mutate();
      return;
    }
    sendMessageMutation.mutate(content);
  };

  const handleLogout = () => {
    // Implement logout functionality
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <ChatHeader onLogout={handleLogout} />
        
        <ChatMessages 
          messages={messages}
          isLoading={messagesLoading}
          isTyping={isTyping}
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
}
