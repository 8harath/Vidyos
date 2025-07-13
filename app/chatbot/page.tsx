'use client'

import { useState, useEffect } from 'react'
import { GeminiChatBot } from '@/components/gemini-chat-bot'
import { ChatBot } from '@/components/chat-bot'
import { GeminiConfig, type GeminiConfig as GeminiConfigType } from '@/components/gemini-config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, MessageSquare, Settings } from 'lucide-react'

export default function ChatBotDemo() {
  const [config, setConfig] = useState<GeminiConfigType | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('gemini-config')
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig(parsedConfig)
        setIsConfigured(true)
      } catch (error) {
        console.error('Failed to parse saved config:', error)
      }
    }
  }, [])

  const handleConfigSave = (newConfig: GeminiConfigType) => {
    setConfig(newConfig)
    setIsConfigured(true)
    localStorage.setItem('gemini-config', JSON.stringify(newConfig))
  }

  const resetConfig = () => {
    setConfig(null)
    setIsConfigured(false)
    localStorage.removeItem('gemini-config')
  }

  if (!isConfigured || !config) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Gemini AI Chatbot</h1>
            <p className="text-muted-foreground">
              Connect to Google Gemini AI and start intelligent conversations
            </p>
          </div>

          <div className="mb-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  To use the chatbot, you need to configure your Gemini API settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Gemini API Key</h3>
                      <p className="text-sm text-muted-foreground">
                        Visit Google AI Studio to obtain your free API key
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Choose Model</h3>
                      <p className="text-sm text-muted-foreground">
                        Select from Gemini 1.5 Flash (fast) or Gemini 1.5 Pro (advanced)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Configure Below</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your API key and other settings to start chatting
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <GeminiConfig onConfigSave={handleConfigSave} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Gemini AI Chatbot</h1>
          <p className="text-muted-foreground mb-4">
            Connected to Google Gemini AI
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">
              Model: {config.model}
            </Badge>
            <Badge variant={config.demoMode ? "default" : "outline"}>
              {config.demoMode ? "Demo Mode" : "Production"}
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-muted"
              onClick={resetConfig}
            >
              <Settings className="w-3 h-3 mr-1" />
              Reconfigure
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="enhanced" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enhanced" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Enhanced Chat
            </TabsTrigger>
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Standard Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="enhanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Enhanced Gemini Chat
                </CardTitle>
                <CardDescription>
                  Advanced interface with enhanced features and visual feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeminiChatBot
                  apiKey={config.apiKey}
                  model={config.model}
                  title="Gemini AI Assistant"
                  placeholder="Ask me anything..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="standard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Standard Chat
                </CardTitle>
                <CardDescription>
                  Simple, clean interface for straightforward conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatBot
                  apiKey={config.apiKey}
                  model={config.model}
                  title="Gemini Assistant"
                  placeholder="Type your message..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
