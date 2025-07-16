import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class GmailService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback'
    );
  }

  private createEmailMessage(to: string, from: string, subject: string, htmlBody: string, textBody: string): string {
    const messageParts = [
      `To: ${to}`,
      `From: ${from}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="boundary123"',
      '',
      '--boundary123',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      textBody,
      '',
      '--boundary123',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlBody,
      '',
      '--boundary123--'
    ];
    
    const message = messageParts.join('\n');
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async sendEmail(to: string, from: string, subject: string, htmlBody: string, textBody: string): Promise<boolean> {
    try {
      // For now, we'll simulate email sending like we do with calendar
      // In production, you would need to handle OAuth2 flow properly
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      const encodedMessage = this.createEmailMessage(to, from, subject, htmlBody, textBody);
      
      // This would require proper OAuth2 setup in production
      console.log('Gmail email would be sent:', {
        to,
        from, 
        subject,
        bodyPreview: textBody.substring(0, 100) + '...'
      });
      
      return true;
    } catch (error) {
      console.error('Error sending Gmail email:', error);
      return false;
    }
  }
}

const gmailService = new GmailService();

interface AppointmentEmailData {
  userEmail: string;
  appointmentSummary: string;
  appointmentDate: string;
  appointmentTime: string;
  calendarEventId: string;
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<boolean> {
  try {
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Appointment Confirmed</h1>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
        <h2 style="color: #1e293b; margin-top: 0;">Your appointment has been scheduled!</h2>
        
        <div style="background-color: white; padding: 16px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 16px 0;">
          <h3 style="margin-top: 0; color: #2563eb;">Appointment Details</h3>
          <p><strong>Type:</strong> ${data.appointmentSummary}</p>
          <p><strong>Date:</strong> ${data.appointmentDate}</p>
          <p><strong>Time:</strong> ${data.appointmentTime}</p>
          <p><strong>Calendar Event ID:</strong> ${data.calendarEventId}</p>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 16px; border-radius: 6px; border: 1px solid #d1fae5; margin: 16px 0;">
          <h4 style="margin-top: 0; color: #059669;">What's Next?</h4>
          <ul style="margin-bottom: 0; color: #047857;">
            <li>This appointment has been added to your Google Calendar</li>
            <li>You'll receive a calendar notification before your appointment</li>
            <li>Please arrive 15 minutes early for check-in</li>
            <li>Bring a valid ID and insurance card</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            Need to reschedule? Reply to this email or contact our office.<br>
            Thank you for choosing our medical services!
          </p>
        </div>
      </div>
    </div>
    `;

    const textContent = `
Appointment Confirmed!

Your ${data.appointmentSummary} appointment has been scheduled for:
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}

This appointment has been added to your Google Calendar.
Please arrive 15 minutes early and bring a valid ID and insurance card.

Calendar Event ID: ${data.calendarEventId}

Need to reschedule? Reply to this email or contact our office.
Thank you for choosing our medical services!
    `;

    const emailSent = await gmailService.sendEmail(
      data.userEmail,
      process.env.FROM_EMAIL || 'appointments@yourmedicalcenter.com',
      `Appointment Confirmed - ${data.appointmentSummary}`,
      emailContent,
      textContent
    );

    return emailSent;
  } catch (error) {
    console.error('Failed to send appointment confirmation email:', error);
    return false;
  }
}

export async function sendAppointmentReminder(data: AppointmentEmailData): Promise<boolean> {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Appointment Reminder</h1>
        <p>This is a friendly reminder about your upcoming appointment:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p><strong>${data.appointmentSummary}</strong></p>
          <p>${data.appointmentDate} at ${data.appointmentTime}</p>
        </div>
        <p>Please arrive 15 minutes early and bring your ID and insurance card.</p>
      </div>
      `;

    const textContent = `
Appointment Reminder

Your ${data.appointmentSummary} appointment is scheduled for:
${data.appointmentDate} at ${data.appointmentTime}

Please arrive 15 minutes early and bring your ID and insurance card.
    `;

    const emailSent = await gmailService.sendEmail(
      data.userEmail,
      process.env.FROM_EMAIL || 'appointments@yourmedicalcenter.com',
      `Reminder: ${data.appointmentSummary} Tomorrow`,
      htmlContent,
      textContent
    );

    return emailSent;
  } catch (error) {
    console.error('Failed to send appointment reminder email:', error);
    return false;
  }
}