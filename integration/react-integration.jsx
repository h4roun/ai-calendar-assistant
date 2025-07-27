/**
 * React Integration Examples for AI Appointment Chatbot
 * 
 * This file shows different ways to integrate the AI chatbot
 * into React applications.
 */

import { useEffect, useState } from 'react';

// Method 1: Simple Hook-based Integration
function useChatbot(config) {
  useEffect(() => {
    let script = null;
    
    const loadChatbot = () => {
      // Create script element
      script = document.createElement('script');
      script.src = `${config.serverUrl}/chatbot-embed.js`;
      script.async = true;
      
      // Initialize chatbot when script loads
      script.onload = () => {
        if (window.initFloatingChatbot) {
          window.initFloatingChatbot(config);
        }
      };
      
      // Handle script load errors
      script.onerror = () => {
        console.error('Failed to load AI chatbot script');
      };
      
      document.body.appendChild(script);
    };
    
    loadChatbot();
    
    // Cleanup on unmount
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Remove chatbot if it exists
      if (window.removeChatbot) {
        window.removeChatbot();
      }
    };
  }, [config]);
}

// Method 2: App-level Integration
function App() {
  useChatbot({
    position: 'bottom-right',
    primaryColor: '#f3202e',
    serverUrl: 'https://your-chatbot-domain.com'
  });

  return (
    <div className="App">
      <header>
        <h1>Medical Practice</h1>
      </header>
      <main>
        {/* Your app content */}
      </main>
    </div>
  );
}

// Method 3: Conditional Loading Component
function ConditionalChatbot({ showOnRoutes = [], hideOnRoutes = [] }) {
  const [shouldShow, setShouldShow] = useState(false);
  const currentPath = window.location.pathname;
  
  useEffect(() => {
    // Show on specific routes
    if (showOnRoutes.length > 0) {
      setShouldShow(showOnRoutes.some(route => currentPath.includes(route)));
    }
    // Hide on specific routes
    else if (hideOnRoutes.some(route => currentPath.includes(route))) {
      setShouldShow(false);
    }
    // Show by default
    else {
      setShouldShow(true);
    }
  }, [currentPath, showOnRoutes, hideOnRoutes]);
  
  useChatbot(shouldShow ? {
    position: 'bottom-right',
    primaryColor: '#f3202e',
    serverUrl: 'https://your-chatbot-domain.com'
  } : null);
  
  return null; // This component doesn't render anything
}

// Method 4: Context-based Integration
import { createContext, useContext, useProviderValue } from 'react';

const ChatbotContext = createContext();

export function ChatbotProvider({ children, config }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  
  useEffect(() => {
    if (!isEnabled) return;
    
    const script = document.createElement('script');
    script.src = `${config.serverUrl}/chatbot-embed.js`;
    script.async = true;
    
    script.onload = () => {
      if (window.initFloatingChatbot) {
        window.initFloatingChatbot(config);
        setIsLoaded(true);
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsLoaded(false);
    };
  }, [config, isEnabled]);
  
  const value = {
    isLoaded,
    isEnabled,
    setIsEnabled,
    config
  };
  
  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbotContext() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbotContext must be used within ChatbotProvider');
  }
  return context;
}

// Method 5: Next.js Integration
// pages/_app.js
function MyApp({ Component, pageProps }) {
  useChatbot({
    position: 'bottom-right',
    primaryColor: '#f3202e',
    serverUrl: process.env.NEXT_PUBLIC_CHATBOT_URL
  });

  return <Component {...pageProps} />;
}

// Method 6: Route-specific Integration (React Router)
import { useLocation } from 'react-router-dom';

function RouteChatbot() {
  const location = useLocation();
  const [chatbotConfig, setChatbotConfig] = useState(null);
  
  useEffect(() => {
    // Different configs for different routes
    switch (location.pathname) {
      case '/contact':
      case '/appointment':
      case '/booking':
        setChatbotConfig({
          position: 'bottom-right',
          primaryColor: '#f3202e',
          serverUrl: 'https://your-chatbot-domain.com'
        });
        break;
      case '/emergency':
        setChatbotConfig({
          position: 'bottom-right',
          primaryColor: '#dc2626', // Red for emergency
          serverUrl: 'https://your-chatbot-domain.com'
        });
        break;
      default:
        setChatbotConfig(null); // Don't show chatbot
    }
  }, [location.pathname]);
  
  useChatbot(chatbotConfig);
  return null;
}

// Method 7: Component with Custom Styling
function StyledChatbot({ theme = 'default' }) {
  const themes = {
    medical: {
      position: 'bottom-right',
      primaryColor: '#2563eb',
      serverUrl: 'https://your-chatbot-domain.com'
    },
    dental: {
      position: 'bottom-right',
      primaryColor: '#14b8a6',
      serverUrl: 'https://your-chatbot-domain.com'
    },
    wellness: {
      position: 'bottom-right',
      primaryColor: '#8b5cf6',
      serverUrl: 'https://your-chatbot-domain.com'
    }
  };
  
  useChatbot(themes[theme] || themes.medical);
  return null;
}

// Method 8: Advanced Configuration Component
function AdvancedChatbot({ 
  enabled = true,
  position = 'bottom-right',
  primaryColor = '#f3202e',
  serverUrl,
  customCSS = '',
  onAppointmentBooked = () => {},
  debugMode = false
}) {
  useEffect(() => {
    if (!enabled) return;
    
    const script = document.createElement('script');
    script.src = `${serverUrl}/chatbot-embed.js`;
    
    script.onload = () => {
      if (window.initFloatingChatbot) {
        window.initFloatingChatbot({
          position,
          primaryColor,
          serverUrl,
          customCSS,
          onAppointmentBooked,
          debugMode
        });
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [enabled, position, primaryColor, serverUrl, customCSS, debugMode]);
  
  return null;
}

// Usage Examples:

// Example 1: Basic App Integration
function BasicApp() {
  return (
    <div>
      <h1>My Medical Practice</h1>
      <AdvancedChatbot 
        serverUrl="https://your-chatbot-domain.com"
        primaryColor="#f3202e"
      />
    </div>
  );
}

// Example 2: Multi-page App with Context
function ContextApp() {
  return (
    <ChatbotProvider config={{
      position: 'bottom-right',
      primaryColor: '#f3202e',
      serverUrl: 'https://your-chatbot-domain.com'
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
        </Routes>
      </Router>
    </ChatbotProvider>
  );
}

// Example 3: Conditional Rendering
function ConditionalApp() {
  const [showChatbot, setShowChatbot] = useState(true);
  
  return (
    <div>
      <button onClick={() => setShowChatbot(!showChatbot)}>
        {showChatbot ? 'Hide' : 'Show'} Chatbot
      </button>
      
      {showChatbot && (
        <AdvancedChatbot 
          serverUrl="https://your-chatbot-domain.com"
          onAppointmentBooked={(appointment) => {
            console.log('Appointment booked:', appointment);
            // Handle appointment booking
          }}
        />
      )}
    </div>
  );
}

// Example 4: Environment-based Configuration
function EnvironmentChatbot() {
  const config = {
    position: 'bottom-right',
    primaryColor: '#f3202e',
    serverUrl: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000'
      : 'https://your-chatbot-domain.com',
    debugMode: process.env.NODE_ENV === 'development'
  };
  
  useChatbot(config);
  return null;
}

// Example 5: TypeScript Integration
interface ChatbotConfig {
  position: 'bottom-right' | 'bottom-left';
  primaryColor: string;
  serverUrl: string;
  enabled?: boolean;
  debugMode?: boolean;
}

function TypeScriptChatbot({ config }: { config: ChatbotConfig }) {
  useChatbot(config);
  return null;
}

export default App;

// Export components for use in other files
export {
  useChatbot,
  ConditionalChatbot,
  ChatbotProvider,
  useChatbotContext,
  StyledChatbot,
  AdvancedChatbot,
  TypeScriptChatbot
};