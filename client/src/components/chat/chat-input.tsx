import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
    <form onSubmit={handleSubmit} className="p-3">
      <div className="flex items-center space-x-1">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full rounded-full px-6 py-3 pr-12 focus:ring-2 focus:ring-primary"
            placeholder="Describe your appointment..."
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="bg-primary hover:bg-blue-700 text-white rounded-lg px-3 py-2"
          size="sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("doctor")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px- py-2"
        >
          <Stethoscope size={12} className="mr-1" />
          Doctor Visit
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("dentist")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1"
        >
          <Activity size={12} className="mr-1" />
          Dentist
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("specialist")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1"
        >
          <UserCheck size={12} className="mr-1" />
          Specialist
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleQuickAction("check-up")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1"
        >
          <Heart size={12} className="mr-1" />
          Check-up
        </Button>
      </div>
    </form>
  );
}
