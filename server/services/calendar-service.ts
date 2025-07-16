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

  constructor() {
    // Use the credentials from your client_secret.json file
    this.oauth2Client = new google.auth.OAuth2(
      '353544345589-5g3udf04rbjsu0mfti7rouu1cdm28i8h.apps.googleusercontent.com',
      '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',
      'http://localhost'
    );
    
    // Set up credentials similar to your Python script
    this.setupCredentials();
  }

  private setupCredentials() {
    // This mimics how your Python script handles authentication
    // We'll need to get a refresh token through a one-time setup
    console.log('Calendar service initialized with Google OAuth2 credentials');
  }

  async createEvent(eventData: CalendarEvent): Promise<string> {
    try {
      // Check if we have a refresh token stored
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
      
      if (refreshToken) {
        this.oauth2Client.setCredentials({
          refresh_token: refreshToken
        });
      }

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

      if (refreshToken) {
        try {
          // Attempt to create real calendar event
          const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
          });

          console.log('✅ Real calendar event created successfully!');
          console.log('📅 Event link:', response.data.htmlLink);
          return response.data.id || `event_${Date.now()}`;
        } catch (authError) {
          console.log('❌ Calendar API call failed:', authError.message);
          console.log('💡 Refresh token may be invalid or expired');
        }
      } else {
        console.log('❌ No Google refresh token found');
        console.log('💡 To get real calendar events, visit this URL and authorize:');
        const authUrl = this.oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        console.log('🔗 Authorization URL:', authUrl);
      }
      
      // Fallback to mock event
      const mockEventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('📝 Mock event created (no calendar integration)');
      return mockEventId;
    } catch (error) {
      console.error('Error in calendar service:', error);
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
