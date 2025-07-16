import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertConversationSchema, insertAppointmentSchema } from "@shared/schema";
import { processAppointmentRequest, generateChatResponse } from "./services/openai-service";
import { calendarService } from "./services/calendar-service";
import { sendAppointmentConfirmation } from "./services/email-service";

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
      let appointmentCreated = false;
      let appointmentDetails = null;

      try {
        // Check if the message contains appointment scheduling intent
        const appointmentKeywords = ['appointment', 'schedule', 'book', 'doctor', 'dentist', 'medical'];
        const containsAppointmentIntent = appointmentKeywords.some(keyword => 
          content.toLowerCase().includes(keyword)
        );

        if (containsAppointmentIntent) {
          // Extract appointment details using OpenAI
          const extractedDetails = await processAppointmentRequest(content);
          
          // Create calendar event
          const eventId = await calendarService.createEvent(extractedDetails);
          
          // Save appointment to database
          const appointment = await storage.createAppointment({
            userId: 1, // Mock user ID
            messageId: userMessage.id,
            summary: extractedDetails.summary,
            startTime: new Date(extractedDetails.start_time),
            endTime: new Date(extractedDetails.end_time),
            calendarEventId: eventId,
            status: 'scheduled'
          });

          appointmentCreated = true;
          appointmentDetails = appointment;

          // Send confirmation email
          const appointmentDate = new Date(extractedDetails.start_time);
          const emailSent = await sendAppointmentConfirmation({
            userEmail: process.env.USER_EMAIL || 'user@example.com',
            appointmentSummary: extractedDetails.summary,
            appointmentDate: appointmentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            appointmentTime: appointmentDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            calendarEventId: eventId
          });

          if (emailSent) {
            console.log('Appointment confirmation email sent successfully');
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
      if (appointmentCreated && appointmentDetails) {
        aiResponseContent = `Perfect! I've successfully scheduled your appointment. Here are the details:

**${appointmentDetails.summary}**
📅 **Date & Time:** ${appointmentDetails.startTime.toLocaleString()}
📍 **Location:** To be confirmed
✅ **Status:** Scheduled

Your appointment has been added to your Google Calendar. You should receive a confirmation email shortly.

Is there anything else I can help you with?`;
      } else {
        aiResponseContent = await generateChatResponse(content, context);
      }

      // Save AI response
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiResponseContent,
        role: 'assistant',
        metadata: appointmentCreated ? { appointmentId: appointmentDetails?.id } : null
      });

      res.json({
        userMessage,
        aiMessage,
        appointmentCreated,
        appointmentDetails
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

  // Google OAuth routes
  app.get("/auth/google", async (req, res) => {
    try {
      const authUrl = await calendarService.authenticateUser();
      res.redirect(authUrl);
    } catch (error) {
      res.status(500).json({ message: "Failed to initiate Google authentication" });
    }
  });

  app.get("/auth/google/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (typeof code === 'string') {
        await calendarService.handleAuthCallback(code);
        res.send(`
          <html>
            <body>
              <h2>Authentication Successful!</h2>
              <p>You can now close this window and return to the chat.</p>
              <script>window.close();</script>
            </body>
          </html>
        `);
      } else {
        res.status(400).json({ message: "Invalid authorization code" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to complete Google authentication" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
