import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Stethoscope, Activity, UserCheck, Heart } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleQuickAction = (suggestion: string) => {
    setMessage(`I need to schedule a ${suggestion} appointment`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full rounded-full px-6 py-3 pr-12 focus:ring-2 focus:ring-primary"
            placeholder="Describe your appointment (e.g., 'Doctor appointment tomorrow at 3 PM')..."
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
          >
            <Paperclip size={16} />
          </Button>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="bg-primary hover:bg-blue-700 text-white rounded-full p-3 w-12 h-12"
        >
          <Send size={16} />
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("doctor")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <Stethoscope size={14} className="mr-2" />
          Doctor Visit
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("dentist")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <Activity size={14} className="mr-2" />
          Dentist
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("specialist")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <UserCheck size={14} className="mr-2" />
          Specialist
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("check-up")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <Heart size={14} className="mr-2" />
          Check-up
        </Button>
      </div>
    </form>
  );
}
