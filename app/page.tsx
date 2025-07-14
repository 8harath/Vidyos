import { ChatBot } from '@/components/chat-bot'

export default function SarvamChatbot() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sarvam AI Chatbot</h1>
          <p className="text-muted-foreground mb-4">
            Powered by Sarvam AI
          </p>
        </div>
        <ChatBot title="Sarvam AI Assistant" placeholder="Ask me anything..." />
      </div>
    </div>
  )
} 