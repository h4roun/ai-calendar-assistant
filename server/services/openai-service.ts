import { AzureOpenAI } from 'openai';

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "your-key",
  apiVersion: "your-version",
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || "your-endpoint"
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || "your-deployment";

export interface AppointmentDetails {
  summary: string;
  start_time: string;
  end_time: string;
}

export interface MultipleAppointmentResponse {
  appointments: AppointmentDetails[];
  response_message: string;
}

export async function processAppointmentRequest(userInput: string): Promise<MultipleAppointmentResponse> {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const systemPrompt = `You are an assistant that extracts medical appointment details from user messages in ANY language (English, French, Spanish, etc.). 

IMPORTANT: You must return a JSON object with this exact structure:
{
  "appointments": [
    {
      "summary": "Doctor appointment",
      "start_time": "2025-07-18T09:00:00+02:00",
      "end_time": "2025-07-18T10:00:00+02:00"
    }
  ],
  "response_message": "I've scheduled your appointment(s) successfully!"
}

Rules:
- Extract ALL appointments mentioned in the message, even if multiple
- CAREFULLY parse the EXACT time mentioned by the user - DO NOT change it
- If user says "10 AM", schedule at 10:00, NOT 9:00 or any other time
- Use ISO 8601 format with Europe/Paris timezone (+01:00)
- If no time specified, use business hours (9 AM - 5 PM)
- If no date specified, use next available weekday
- Today's date is ${currentDate}
- Always schedule in the future from this date
- Response message should be in the same language as the user input
- Make appointment duration 1 hour unless specified otherwise

Examples:
- "I need a dentist appointment tomorrow at 10 AM" → start_time: "2025-07-XX:T10:00:00+02:00" (NOT 9:00!)
- "Book doctor July 18th 9am and dentist July 19th 10am" → Two appointments at 9:00 and 10:00 respectively

CRITICAL: Always use the EXACT time the user specifies. Never modify their requested time.`;

  try {
    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      response_format: { type: "json_object" }, // Force JSON output
      temperature: 0.1,
      max_tokens: 800
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Clean the JSON response (remove markdown formatting if present)
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const appointmentData = JSON.parse(cleanContent);
    
    // Validate the structure
    if (!appointmentData.appointments || !Array.isArray(appointmentData.appointments)) {
      throw new Error("Invalid appointment data structure - missing appointments array");
    }

    // Validate each appointment
    for (const apt of appointmentData.appointments) {
      if (!apt.summary || !apt.start_time || !apt.end_time) {
        throw new Error("Invalid appointment data - missing required fields");
      }
    }

    return {
      appointments: appointmentData.appointments,
      response_message: appointmentData.response_message || "Appointment(s) scheduled successfully!"
    };
  } catch (error) {
    console.error("Error processing appointment request:", error);
    
    // Fallback: Try to create a single appointment from the user input
    const fallbackAppointment: AppointmentDetails = {
      summary: "Medical appointment",
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('Z', '+02:00'), // Tomorrow
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString().replace('Z', '+02:00') // Tomorrow + 1 hour
    };
    
    return {
      appointments: [fallbackAppointment],
      response_message: "I've created a basic appointment. Please provide more details if needed."
    };
  }
}

export async function generateChatResponse(userMessage: string, context: string[] = []): Promise<string> {
  const systemPrompt = `You are a helpful AI appointment assistant. You help users schedule medical appointments and answer questions about their calendar.

IMPORTANT INSTRUCTIONS:
- Respond in the SAME LANGUAGE as the user's message (English, French, Spanish, etc.)
- Be friendly, professional, and concise in your responses
- If a user asks about scheduling an appointment, acknowledge their request
- Support multilingual conversations naturally

Language examples:
- English: "I can help you schedule your appointment."
- French: "Je peux vous aider à programmer votre rendez-vous."
- Spanish: "Puedo ayudarte a programar tu cita."`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...context.map((msg, index) => ({
        role: index % 2 === 0 ? "user" as const : "assistant" as const,
        content: msg
      })),
      { role: "user", content: userMessage }
    ];

    const response = await client.chat.completions.create({
      model: deploymentName,
      messages,
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Désolé, je n'ai pas pu programmer le rendez-vous. Pouvez-vous reformuler la demande? (I apologize, but I'm experiencing some technical difficulties. Please try again later.)";
  }
}
