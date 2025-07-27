# AI Appointment Chatbot Integration Guide

Main Tutorial: app-guide.md - Complete step-by-step guide
Quick Guide: how-to-add.md - Fast 2-minute setup

## Overview

This guide shows you how to add our AI-powered appointment scheduling chatbot to any website. The chatbot creates real Google Calendar events and supports multiple languages including English, French, and Spanish.

## Features

- **Real Calendar Integration**: Creates actual Google Calendar events
- **Smart Time Parsing**: Preserves exact appointment times you specify
- **Multiple Appointments**: Handle several bookings in one message
- **Multilingual Support**: Works in English, French, Spanish
- **Floating Widget**: Non-intrusive chat bubble design
- **Mobile Responsive**: Works on all devices

## Quick Start (3 Steps)

## 🔐 Required Files (Not Included)

**⚠️ Note:** The `attached_assets/` folder includes sample files for structure reference only — they won't work unless you replace the placeholders.

To use the calendar integration, you must provide two files in the root folder:

- `client_secret.json` → Download this from your Google Cloud project.
- `token.json` → This will be generated automatically the first time you authorize the app.

Also, don't forget to create a `.env` file with your Azure OpenAI credentials as follows:

AZURE_OPENAI_API_KEY=your azure open ai api key
AZURE_OPENAI_ENDPOINT=your azure open ai endpoint
GOOGLE_CLIENT_ID=your client ID
GOOGLE_CLIENT_SECRET=your client secret

## 🔐 Google Calendar Setup

To use calendar integration, you must:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the **Google Calendar API**
3. Create OAuth 2.0 credentials for a **desktop app**
4. Download the `client_secret.json` file and place it in the root folder

When you run the app for the first time, it will:

- Open a browser asking for your Google account login
- Ask permission to access your calendar
- Automatically create a `token.json` file in the root folder (do not delete this!)

This process only needs to be done once.

### Step 1: Add the Script

Add this script tag to your website before the closing `</body>` tag:

```html
<script src="https://your-chatbot-domain.com/embed"></script>
```

### Step 2: Initialize the Chatbot

Add this JavaScript code after the script tag:

```html
<script>
  window.initFloatingChatbot({
    position: "bottom-right", // or 'bottom-left'
    primaryColor: "#f3202e", // your brand color
    serverUrl: "https://your-chatbot-domain.com",
  });
</script>
```

### Step 3: Done!

The chatbot will appear as a floating bubble in the bottom corner of your website.

## Installation Methods

### Method 1: Simple HTML (Recommended)

Copy and paste this code into your website:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Your Website</title>
  </head>
  <body>
    <!-- Your existing website content -->

    <!-- AI Chatbot Integration -->
    <script src="https://your-chatbot-domain.com/embed"></script>
    <script>
      window.initFloatingChatbot({
        position: "bottom-right",
        primaryColor: "#f3202e",
        serverUrl: "https://your-chatbot-domain.com",
      });
    </script>
  </body>
</html>
```

### Method 2: React Component

For React applications:

```jsx
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Load the chatbot script
    const script = document.createElement("script");
    script.src = "https://your-chatbot-domain.com/embed";
    script.onload = () => {
      window.initFloatingChatbot({
        position: "bottom-right",
        primaryColor: "#f3202e",
        serverUrl: "https://your-chatbot-domain.com",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div>{/* Your app content */}</div>;
}
```

### Method 3: WordPress

For WordPress websites, add this to your theme's `footer.php` file:

```php
<!-- AI Chatbot Integration -->
<script src="https://your-chatbot-domain.com/embed"></script>
<script>
    window.initFloatingChatbot({
        position: 'bottom-right',
        primaryColor: '<?php echo get_theme_mod('primary_color', '#f3202e'); ?>',
        serverUrl: 'https://your-chatbot-domain.com'
    });
</script>
```

## Configuration Options

### Basic Configuration

```javascript
window.initFloatingChatbot({
  position: "bottom-right", // Position: 'bottom-right' or 'bottom-left'
  primaryColor: "#f3202e", // Hex color for the chat bubble
  serverUrl: "https://...", // Your chatbot server URL
});
```

### Advanced Configuration

```javascript
window.initFloatingChatbot({
  position: "bottom-right",
  primaryColor: "#f3202e",
  serverUrl: "https://your-chatbot-domain.com",

  // Optional: Custom styling
  width: "400px", // Chat window width
  height: "500px", // Chat window height

  // Optional: Custom text
  welcomeMessage: "Hi! I can help you schedule appointments.",
  placeholder: "Describe your appointment...",

  // Optional: Disable on certain pages
  enabledPages: ["/contact", "/booking"], // Only show on these pages
  disabledPages: ["/admin"], // Hide on these pages
});
```

## Customization Examples

### Match Your Brand Colors

```javascript
// Medical practice (blue/green)
window.initFloatingChatbot({
  position: "bottom-right",
  primaryColor: "#2563eb", // Blue
  serverUrl: "https://your-chatbot-domain.com",
});

// Dental practice (teal)
window.initFloatingChatbot({
  position: "bottom-right",
  primaryColor: "#14b8a6", // Teal
  serverUrl: "https://your-chatbot-domain.com",
});

// Wellness center (purple)
window.initFloatingChatbot({
  position: "bottom-right",
  primaryColor: "#8b5cf6", // Purple
  serverUrl: "https://your-chatbot-domain.com",
});
```

### Different Positions

```javascript
// Bottom left corner
window.initFloatingChatbot({
  position: "bottom-left",
  primaryColor: "#f3202e",
  serverUrl: "https://your-chatbot-domain.com",
});
```

## Usage Examples

Once installed, your visitors can interact with the chatbot using natural language:

### English Examples

- "I need a doctor appointment next Tuesday at 2 PM"
- "Schedule dentist visit July 25th 10:30 AM"
- "Doctor tomorrow 3pm and dentist Friday 11am"

### French Examples

- "J'ai besoin d'un rendez-vous docteur mardi 14h"
- "Réserver dentiste 25 juillet 10h30"
- "Rendez-vous docteur demain 15h"

### Spanish Examples

- "Necesito cita con doctor martes 14:00"
- "Reservar dentista 25 julio 10:30"
- "Cita doctor mañana 15:00"

## Setup Requirements

### Prerequisites

1. **Google Calendar API Access**: The chatbot needs Google Calendar credentials
2. **Azure OpenAI Account**: For natural language processing
3. **Web Server**: To host the chatbot backend

### Environment Variables

Your chatbot server needs these environment variables:

```bash
# Google Calendar Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint

# Database
DATABASE_URL=your_postgresql_connection_string
```

## Deployment Options

### Option 1: Replit Hosting (Easiest)

1. Deploy the chatbot to Replit
2. Get your Replit app URL (e.g., `https://your-app.replit.app`)
3. Use this URL as your `serverUrl` in the integration code

### Option 2: Your Own Server

1. Deploy the Node.js application to your server
2. Set up a domain (e.g., `https://chatbot.yourdomain.com`)
3. Use this URL as your `serverUrl`

### Option 3: Cloud Platforms

Deploy to platforms like:

- Vercel
- Netlify
- Railway
- Heroku

## Testing Your Integration

### 1. Visual Check

- Look for the red chat bubble in the bottom corner
- Click it to open the chat window
- Verify the colors match your brand

### 2. Functionality Test

- Send a test message: "doctor appointment tomorrow 2pm"
- Check if a calendar event is created
- Verify the time is correct

### 3. Mobile Test

- Test on mobile devices
- Ensure the chat window fits properly
- Check that typing works on mobile keyboards

## Troubleshooting

### Common Issues

**Chatbot doesn't appear:**

- Check browser console for JavaScript errors
- Verify the script URL is correct
- Ensure `initFloatingChatbot` is called after script loads

**Messages don't send:**

- Check server URL is accessible
- Verify CORS settings allow your domain
- Check network tab for API call failures

**Calendar events not created:**

- Verify Google Calendar credentials are correct
- Check server logs for authentication errors
- Ensure calendar API is enabled

### Browser Console Debugging

Open browser developer tools (F12) and check for errors:

```javascript
// Test if chatbot loaded
console.log(window.initFloatingChatbot); // Should show function

// Check current configuration
console.log(window.chatbotConfig); // Shows current settings
```

## Support & Customization

### Free Support Includes

- Basic installation help
- Configuration assistance
- Bug fixes and updates

### Premium Customization Available

- Custom styling and branding
- Integration with your existing booking system
- Additional language support
- Custom appointment types and workflows

## Security & Privacy

### Data Handling

- Messages are processed securely
- No personal data is stored unnecessarily
- GDPR and CCPA compliant

### HTTPS Required

- The chatbot requires HTTPS for security
- Calendar integration needs secure connections
- Most modern hosting platforms provide HTTPS automatically

## FAQ

**Q: Does this work on mobile?**
A: Yes, the chatbot is fully responsive and works on all devices.

**Q: Can I customize the appearance?**
A: Yes, you can customize colors, position, and text through configuration options.

**Q: What languages are supported?**
A: Currently English, French, and Spanish with more languages coming soon.

**Q: Do I need my own Google Calendar?**
A: Yes, the chatbot creates events in your Google Calendar using your credentials.

**Q: Can visitors book multiple appointments?**
A: Yes, they can say "doctor Monday 2pm and dentist Tuesday 10am" for multiple bookings.

**Q: Is there a usage limit?**
A: Usage limits depend on your Azure OpenAI and Google Calendar API quotas.

## Next Steps

1. **Get Started**: Follow the Quick Start guide above
2. **Test Integration**: Use the testing checklist
3. **Customize**: Adjust colors and positioning to match your brand
4. **Go Live**: Deploy to your production website

For additional help or custom integration needs, contact our support team.
