import { AzureOpenAI } from 'openai';

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "default_key",
  apiVersion: "2025-01-01-preview",
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || "https://openai-instance-haroun.openai.azure.com/openai/deployments/gpt-haroun/chat/completions?api-version=2025-01-01-preview"
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-haroun";

export interface AppointmentDetails {
  summary: string;
  start_time: string;
  end_time: string;
}

export async function processAppointmentRequest(userInput: string): Promise<AppointmentDetails> {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const systemPrompt = `You are an assistant that extracts medical appointment details. 
The user will describe a situation, and you must return a JSON object 
with the fields: summary, start_time, and end_time in ISO 8601 format.
Make sure the times are reasonable and in the future.
If the user doesn't specify a time, suggest a reasonable time during business hours (9 AM - 5 PM).
If the user doesn't specify a date, use the next available weekday.
Today's date is ${currentDate}. Always schedule appointments in the future from this date.
Use the timezone Europe/Paris for all appointments.`;

  try {
    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const appointmentData = JSON.parse(content);
    
    // Validate the required fields
    if (!appointmentData.summary || !appointmentData.start_time || !appointmentData.end_time) {
      throw new Error("Invalid appointment data structure");
    }

    return appointmentData as AppointmentDetails;
  } catch (error) {
    console.error("Error processing appointment request:", error);
    throw new Error("Failed to process appointment request");
  }
}

export async function generateChatResponse(userMessage: string, context: string[] = []): Promise<string> {
  const systemPrompt = `You are a helpful AI appointment assistant. You help users schedule medical appointments and answer questions about their calendar.
Be friendly, professional, and concise in your responses.
If a user asks about scheduling an appointment, acknowledge their request and let them know you're processing it.`;

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
    return "I apologize, but I'm experiencing some technical difficulties. Please try again later.";
  }
}
