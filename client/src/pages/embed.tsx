import FloatingChatWidget from "../components/floating-chatbot/floating-chat-widget";

export default function EmbedPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Demo Content - This would be your actual website */}
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medical Practice Website
          </h1>
          <p className="text-xl text-gray-600">
            Book appointments easily with our AI assistant
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• General Medicine</li>
              <li>• Dental Care</li>
              <li>• Specialist Consultations</li>
              <li>• Preventive Care</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Office Hours</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM</p>
              <p><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
              <p><strong>Sunday:</strong> Closed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Easy Online Booking</h2>
          <p className="text-gray-600 mb-6">
            Use our AI assistant in the bottom-right corner to schedule appointments instantly!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Step 1</h3>
              <p className="text-sm text-blue-700">Click the chat icon</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Step 2</h3>
              <p className="text-sm text-green-700">Tell us your needs</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Step 3</h3>
              <p className="text-sm text-purple-700">Get instant booking</p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>&copy; 2025 Medical Practice. All rights reserved.</p>
        </footer>
      </div>

      {/* The Floating Chat Widget */}
      <FloatingChatWidget 
        position="bottom-right"
        primaryColor="#f3202e"
      />
    </div>
  );
}