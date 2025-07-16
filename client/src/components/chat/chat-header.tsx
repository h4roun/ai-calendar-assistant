import { Button } from "@/components/ui/button";
import { Bot, Settings, LogOut, Calendar } from "lucide-react";

interface ChatHeaderProps {
  onLogout: () => void;
}

export default function ChatHeader({ onLogout }: ChatHeaderProps) {
  return (
    <header className="text-white p-6 flex items-center justify-between bg-[#f3202e]">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <Bot className="text-primary text-xl" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">AI Appointment Assistant</h1>
          <div className="flex items-center space-x-2 text-blue-200">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">

        <Button
          variant="ghost"
          size="sm"
          className="text-blue-200 hover:text-white hover:bg-blue-600"
        >
          <Settings size={18} />
        </Button>
        <Button
          onClick={onLogout}
          className="hover:bg-blue-700 text-white bg-[#4a060b]"
          size="sm"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
