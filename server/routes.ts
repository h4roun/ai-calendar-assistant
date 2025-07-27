import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertConversationSchema, insertAppointmentSchema } from "@shared/schema";
import { processAppointmentRequest, generateChatResponse } from "./services/openai-service";
import { calendarService } from "./services/calendar-service";
// import { sendAppointmentConfirmation } from "./services/email-service"; // Temporarily disabled

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all conversations for current user (mock user ID = 1)
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getUserConversations(1);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse({
        ...req.body,
        userId: 1 // Mock user ID
      });
      
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Invalid conversation data" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        role: 'user',
        metadata: null
      });

      // Process the message for appointment scheduling
      let appointmentsCreated = false;
      let createdAppointments = [];
      let aiResponseFromAppointment = null;

      try {
        // Check if the message contains appointment scheduling intent
        const appointmentKeywords = [
          'appointment', 'schedule', 'book', 'doctor', 'dentist', 'medical', 
          'rendez-vous', 'réserver', 'docteur', 'dentiste', 'médical',
          'cita', 'programar', 'médico', 'dentista'
        ];
        const containsAppointmentIntent = appointmentKeywords.some(keyword => 
          content.toLowerCase().includes(keyword.toLowerCase())
        );

        if (containsAppointmentIntent) {
          // Extract appointment details using OpenAI (now supports multiple appointments)
          const extractedData = await processAppointmentRequest(content);
          
          // Process each appointment
          for (const appointmentDetail of extractedData.appointments) {
            try {
              // Create calendar event
              const eventId = await calendarService.createEvent(appointmentDetail);
              
              // Save appointment to database
              const appointment = await storage.createAppointment({
                userId: 1, // Mock user ID
                messageId: userMessage.id,
                summary: appointmentDetail.summary,
                startTime: new Date(appointmentDetail.start_time),
                endTime: new Date(appointmentDetail.end_time),
                calendarEventId: eventId,
                status: 'scheduled'
              });

              createdAppointments.push(appointment);
              console.log('Appointment created successfully - calendar event ID:', eventId);
            } catch (singleAppointmentError) {
              console.error('Error creating single appointment:', singleAppointmentError);
            }
          }

          if (createdAppointments.length > 0) {
            appointmentsCreated = true;
            aiResponseFromAppointment = extractedData.response_message;
          }
        }
      } catch (appointmentError) {
        console.error("Error processing appointment:", appointmentError);
        // Continue with regular chat response even if appointment processing fails
      }

      // Generate AI response
      const conversationMessages = await storage.getConversationMessages(conversationId);
      const context = conversationMessages.slice(-5).map(msg => msg.content); // Last 5 messages for context
      
      let aiResponseContent;
      if (appointmentsCreated && createdAppointments.length > 0) {
        // Use the AI-generated response message from OpenAI
        if (aiResponseFromAppointment) {
          aiResponseContent = aiResponseFromAppointment;
        } else {
          // Fallback response
          if (createdAppointments.length === 1) {
            const apt = createdAppointments[0];
            aiResponseContent = `Perfect! I've successfully scheduled your appointment:

**${apt.summary}**
📅 **Date & Time:** ${apt.startTime.toLocaleString()}
✅ **Status:** Scheduled

Your appointment has been added to your Google Calendar.`;
          } else {
            aiResponseContent = `Excellent! I've successfully scheduled ${createdAppointments.length} appointments:

${createdAppointments.map((apt, index) => 
  `**${index + 1}. ${apt.summary}**\n📅 ${apt.startTime.toLocaleString()}`
).join('\n\n')}

All appointments have been added to your Google Calendar.`;
          }
        }
      } else {
        aiResponseContent = await generateChatResponse(content, context);
      }

      // Save AI response
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiResponseContent,
        role: 'assistant',
        metadata: appointmentsCreated ? { appointmentIds: createdAppointments.map(apt => apt.id) } : null
      });

      res.json({
        userMessage,
        aiMessage,
        appointmentCreated: appointmentsCreated,
        appointmentDetails: createdAppointments.length === 1 ? createdAppointments[0] : createdAppointments
      });

    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Get user appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getUserAppointments(1); // Mock user ID
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // OAuth routes temporarily removed for stability

  const httpServer = createServer(app);
  return httpServer;
}
