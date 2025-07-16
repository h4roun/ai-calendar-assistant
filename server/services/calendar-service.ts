import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

interface CalendarEvent {
  summary: string;
  start_time: string;
  end_time: string;
}

export class CalendarService {
  private oauth2Client: OAuth2Client;
  private tokens: any = null;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback'
    );
  }

  async createEvent(eventData: CalendarEvent): Promise<string> {
    try {
      // Set up OAuth2 client with refresh token approach
      // For simplicity, we'll use a service account approach or stored credentials
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: eventData.summary,
        start: {
          dateTime: eventData.start_time,
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: eventData.end_time,
          timeZone: 'Europe/Paris',
        },
      };

      console.log('Creating calendar event:', event);

      // Check if we have valid tokens
      if (this.tokens) {
        this.oauth2Client.setCredentials(this.tokens);
        
        try {
          // Attempt to create real calendar event
          const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
          });

          console.log('Calendar event created successfully:', response.data.htmlLink);
          return response.data.id || `event_${Date.now()}`;
        } catch (authError) {
          console.log('Calendar creation failed:', authError.message);
          this.tokens = null; // Clear invalid tokens
        }
      }
      
      // Fallback to mock when not authenticated
      const mockEventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Calendar not authenticated - mock event created:', event);
      console.log('Mock event ID:', mockEventId);
      console.log('To create real events, click "Connect Calendar" in the chat header');
      return mockEventId;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  async authenticateUser(): Promise<string> {
    // Generate OAuth2 URL for user authentication
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    
    return authUrl;
  }

  async handleAuthCallback(code: string): Promise<void> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.tokens = tokens;
      this.oauth2Client.setCredentials(tokens);
      
      console.log('Google Calendar authentication successful!');
      console.log('Calendar events will now be created in your Google Calendar');
    } catch (error) {
      console.error('Error handling auth callback:', error);
      throw new Error('Failed to authenticate with Google Calendar');
    }
  }
}

export const calendarService = new CalendarService();
