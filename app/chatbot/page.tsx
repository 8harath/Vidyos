'use client'

import { useState, useEffect } from 'react'
import { StreamingChatBot } from '@/components/streaming-chat-bot'
import { ChatBot } from '@/components/chat-bot'
import { DifyConfig, type DifyConfig as DifyConfigType } from '@/components/dify-config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, MessageSquare, Settings } from 'lucide-react'

export default function ChatBotDemo() {
  const [config, setConfig] = useState<DifyConfigType | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dify-config')
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

  const handleConfigSave = (newConfig: DifyConfigType) => {
    setConfig(newConfig)
    setIsConfigured(true)
    localStorage.setItem('dify-config', JSON.stringify(newConfig))
  }

  const resetConfig = () => {
    setConfig(null)
    setIsConfigured(false)
    localStorage.removeItem('dify-config')
  }

  if (!isConfigured || !config) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Dify AI Chatbot</h1>
            <p className="text-muted-foreground">
              Connect to your Dify application and start chatting with AI
            </p>
          </div>

          <div className="mb-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  To use the chatbot, you need to configure your Dify API settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Create a Dify Application</h3>
                      <p className="text-sm text-muted-foreground">
                        Go to your Dify dashboard and create a conversational application
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Get API Key</h3>
                      <p className="text-sm text-muted-foreground">
                        Navigate to Applications → Access API → Create API Key
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

          <DifyConfig onConfigSave={handleConfigSave} initialConfig={config || undefined} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Dify AI Chatbot</h1>
          <p className="text-muted-foreground mb-4">
            Connected to your Dify application
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">
              User: {config.user}
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

        <Tabs defaultValue="streaming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="streaming" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Streaming Chat
            </TabsTrigger>
            <TabsTrigger value="blocking" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Standard Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="streaming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Streaming Chat
                </CardTitle>
                <CardDescription>
                  Real-time streaming responses for a more interactive experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StreamingChatBot
                  apiKey={config.apiKey}
                  baseUrl={config.baseUrl}
                  user={config.user}
                  title="AI Assistant (Streaming)"
                  placeholder="Ask me anything..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blocking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Standard Chat
                </CardTitle>
                <CardDescription>
                  Traditional request-response pattern with complete messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatBot
                  apiKey={config.apiKey}
                  baseUrl={config.baseUrl}
                  user={config.user}
                  title="AI Assistant (Standard)"
                  placeholder="Ask me anything..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
