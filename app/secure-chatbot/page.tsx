'use client'

import { useState, useEffect } from 'react'
import { GeminiChatBot } from '@/components/gemini-chat-bot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Lock } from 'lucide-react'

// This is a secure version that uses server-side API calls
export default function SecureChatBot() {
  const [isConfigured, setIsConfigured] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if the server-side API is configured
    checkServerConfig()
  }, [])

  const checkServerConfig = async () => {
    try {
      const response = await fetch('/api/gemini/config')
      if (response.ok) {
        setIsConfigured(true)
      } else {
        setError('Server configuration is required')
      }
    } catch (err) {
      setError('Unable to connect to server')
    }
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              {error}. Please set up your environment variables and restart the server.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Secure Chatbot
              </CardTitle>
              <CardDescription>
                This chatbot uses secure server-side API calls to protect your credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>To use this secure chatbot:</p>
                  <ol className="list-decimal list-inside space-y-1 mt-2">
                    <li>Create a <code>.env.local</code> file in your project root</li>
                    <li>Add your Dify API key: <code>DIFY_API_KEY=your_key_here</code></li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Secure AI Chatbot</h1>
          <p className="text-muted-foreground">
            Protected by server-side API calls
          </p>
        </div>
        
        <GeminiChatBot
          title="Secure Gemini AI Assistant"
          placeholder="Your message is secure..."
        />
      </div>
    </div>
  )
}
