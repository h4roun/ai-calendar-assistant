# 🤖 AI Appointment Chatbot - Integration Tutorial

Main Tutorial: app-guide.md - Complete step-by-step guide
Quick Guide: how-to-add.md - Fast 2-minute setup

## Quick Start (2 Minutes)

Want to add our AI appointment chatbot to your website? Here's how:

### Step 1: Copy this code

```html
<script src="https://your-chatbot-domain.com/embed"></script>
<script>
  window.initFloatingChatbot({
    position: "bottom-right",
    primaryColor: "#f3202e",
    serverUrl: "https://your-chatbot-domain.com",
  });
</script>
```

### Step 2: Paste before `</body>`

Add the code just before the closing `</body>` tag in your HTML.

### Step 3: Done!

A red chat bubble will appear in the bottom-right corner.

## What You Get

✅ **Real Calendar Integration** - Creates actual Google Calendar events  
✅ **Smart Time Parsing** - "2 PM stays 2 PM" accuracy  
✅ **Multiple Languages** - English, French, Spanish support  
✅ **Multiple Bookings** - "doctor Monday 2pm and dentist Tuesday 10am"  
✅ **Mobile Responsive** - Works perfectly on all devices  
✅ **Easy Customization** - Match your brand colors

## Live Examples

### Test the Chatbot

Visit these URLs to see the chatbot in action:

- `http://localhost:5000/embed` - React component Application
- `http://localhost:5000/examples/simple-website.html` - Basic HTML integration
- `http://localhost:5000/examples/customization-examples.html` - Different themes

### Try These Commands

- "I need a doctor appointment next Tuesday at 2 PM"
- "Schedule dentist visit July 25th 10:30 AM"
- "Doctor tomorrow 3pm and dentist Friday 11am"
- "J'ai besoin d'un rendez-vous docteur mardi 14h" (French)

## Platform-Specific Guides

### WordPress

```php
// Add to functions.php
function add_ai_chatbot() {
    if (!is_admin()) {
        ?>
        <script src="https://your-chatbot-domain.com/embed"></script>
        <script>
            window.initFloatingChatbot({
                position: 'bottom-right',
                primaryColor: '#f3202e',
                serverUrl: 'https://your-chatbot-domain.com'
            });
        </script>
        <?php
    }
}
add_action('wp_footer', 'add_ai_chatbot');
```

### React

```jsx
import { useEffect } from "react";

function App() {
  useEffect(() => {
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
  }, []);

  return <div>{/* Your app */}</div>;
}
```

### Shopify

```html
<!-- Add to theme.liquid before </body> -->
<script src="https://your-chatbot-domain.com/embed"></script>
<script>
  window.initFloatingChatbot({
    position: "bottom-right",
    primaryColor: "{{ settings.accent_color }}",
    serverUrl: "https://your-chatbot-domain.com",
  });
</script>
```

## Customization Options

### Different Colors

```javascript
// Medical practice (blue)
primaryColor: "#2563eb";

// Dental practice (teal)
primaryColor: "#14b8a6";

// Wellness center (purple)
primaryColor: "#8b5cf6";

// Emergency services (red)
primaryColor: "#dc2626";
```

### Different Positions

```javascript
// Bottom right (default)
position: "bottom-right";

// Bottom left
position: "bottom-left";
```

### Advanced Configuration

```javascript
window.initFloatingChatbot({
  position: "bottom-right",
  primaryColor: "#f3202e",
  serverUrl: "https://your-chatbot-domain.com",

  // Custom sizing
  width: "400px",
  height: "600px",

  // Custom text
  welcomeMessage: "Hi! I can help schedule appointments.",
  placeholder: "Describe your appointment...",

  // Page controls
  enabledPages: ["/contact", "/booking"],
  disabledPages: ["/admin"],
});
```

## File Structure

```
examples/
├── simple-website.html           # Basic HTML integration
├── wordpress-integration.php     # WordPress functions.php code
├── react-integration.jsx         # React component examples
└── customization-examples.html   # Different themes demo
```

## Setup Requirements

### For Website Owners

- Just add the script tag (no technical setup needed)
- The chatbot connects to our hosted service
- Works on any website (HTML, WordPress, React, etc.)

### For Self-Hosting

If you want to host the chatbot yourself:

1. **Environment Variables**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
DATABASE_URL=your_postgresql_url
```

2. **Deploy the Server**

- Deploy to Replit, Vercel, or your own server
- Set up the environment variables
- Use your deployment URL as `serverUrl`

## Testing Checklist

### Visual Test

- [ ] Chat bubble appears in correct position
- [ ] Colors match your brand
- [ ] Opens/closes smoothly
- [ ] Looks good on mobile

### Functionality Test

- [ ] Send test message: "doctor appointment tomorrow 2pm"
- [ ] Check calendar for new event
- [ ] Verify time accuracy (2pm stays 2pm)
- [ ] Test multiple appointments

### Integration Test

- [ ] Works on all your web pages
- [ ] Doesn't conflict with existing scripts
- [ ] Loads quickly without errors

## Troubleshooting

### Chatbot Doesn't Appear

1. Check browser console for errors (F12)
2. Verify script URL is accessible
3. Ensure JavaScript is enabled

### Messages Don't Send

1. Check server URL is correct
2. Verify network connectivity
3. Check CORS settings

### Calendar Events Not Created

1. Verify Google Calendar credentials
2. Check server logs for errors
3. Ensure calendar API is enabled

## Support

### Documentation

- Full integration guide: `INTEGRATION_GUIDE.md`
- Code examples: `examples/` folder
- API documentation: Available on request

### Help Resources

- GitHub issues for bug reports
- Email support for integration help
- Custom integration services available

## Next Steps

1. **Try the Demo**: Visit the example URLs above
2. **Copy the Code**: Use the integration code for your platform
3. **Customize**: Adjust colors and position to match your brand
4. **Test**: Verify functionality with test appointments
5. **Go Live**: Deploy to your production website

## Advanced Features

### Multiple Languages

The chatbot automatically detects and responds in:

- English: "doctor appointment Tuesday 2pm"
- French: "rendez-vous docteur mardi 14h"
- Spanish: "cita doctor martes 14:00"

### Smart Scheduling

- Preserves exact times you specify
- Handles relative dates ("tomorrow", "next week")
- Supports multiple appointments in one message
- Creates real Google Calendar events

### Professional Features

- GDPR/CCPA compliant
- HTTPS required for security
- Mobile-responsive design
- Enterprise customization available

Ready to add intelligent appointment scheduling to your website? Get started with the Quick Start guide above!
