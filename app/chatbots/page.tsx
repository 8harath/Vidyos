'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Zap, Shield, Settings } from 'lucide-react'

export default function ChatbotIndex() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Gemini AI Chatbot Options</h1>
          <p className="text-muted-foreground">
            Choose the chatbot implementation that best fits your needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurable Chatbot
              </CardTitle>
              <CardDescription>
                Interactive setup with API key configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Blocking
                  </Badge>
                  <Badge variant="secondary">
                    <Zap className="w-3 h-3 mr-1" />
                    Streaming
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Easy setup with visual configuration. Perfect for testing and development.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Interactive API key setup</li>
                  <li>• Connection testing</li>
                  <li>• Local storage for settings</li>
                  <li>• Both streaming and blocking modes</li>
                </ul>
              </div>
              <Link href="/chatbot">
                <Button className="w-full">
                  Open Configurable Chatbot
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Secure Chatbot
              </CardTitle>
              <CardDescription>
                Server-side API calls for production use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="outline">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                  <Badge variant="outline">
                    <Zap className="w-3 h-3 mr-1" />
                    Streaming
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uses environment variables and server-side API calls for enhanced security.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Environment variable configuration</li>
                  <li>• Server-side API calls</li>
                  <li>• No client-side API keys</li>
                  <li>• Production-ready security</li>
                </ul>
              </div>
              <Link href="/secure-chatbot">
                <Button className="w-full" variant="outline">
                  Open Secure Chatbot
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Quick setup guide for both chatbot types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3">Configurable Chatbot</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                      <span>Click "Open Configurable Chatbot"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                      <span>Enter your Dify API key</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                      <span>Test connection and start chatting</span>
                    </li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Secure Chatbot</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                      <span>Create <code>.env.local</code> file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                      <span>Add <code>DIFY_API_KEY=your_key</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                      <span>Restart server and start chatting</span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Check out the{' '}
            <a 
              href="https://docs.dify.ai/guides/application-orchestrate/creating-an-application" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Dify documentation
            </a>
            {' '}for more information.
          </p>
        </div>
      </div>
    </div>
  )
}
