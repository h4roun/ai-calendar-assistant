import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Appointment {
  id: number;
  userId: number;
  messageId: number;
  summary: string;
  startTime: string;
  endTime: string;
  calendarEventId: string | null;
  status: string;
  createdAt: string;
}

interface AppointmentCardProps {
  appointmentId: number;
}

export default function AppointmentCard({ appointmentId }: AppointmentCardProps) {
  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments']
  });

  const appointment = appointments?.find(apt => apt.id === appointmentId);

  if (!appointment) {
    return null;
  }

  const startTime = new Date(appointment.startTime);
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <Calendar className="text-primary mr-2" size={16} />
          {appointment.summary}
        </h4>
        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
          {appointment.status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="text-gray-400 mr-2" size={14} />
          <span>{formattedDate} at {formattedTime}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="text-gray-400 mr-2" size={14} />
          <span>Location to be confirmed</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-sm mt-3">
        <CheckCircle className="text-green-500" size={16} />
        <span className="text-gray-700">Event added to your Google Calendar</span>
      </div>
    </div>
  );
}
