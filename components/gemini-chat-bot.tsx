'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, User, Loader2, Settings, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  isStreaming?: boolean
}
// ...existing code...
interface SarvamChatBotProps {
  apiKey?: string
  title?: string
  placeholder?: string
  className?: string
}

export function SarvamChatBot({ 
  apiKey, 
  title = 'Sarvam AI Assistant',
  placeholder = 'Type your message...',
  className = ''
}: SarvamChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const aiMessageId = (Date.now() + 1).toString()
    const streamingMessage: Message = {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true
    }

    setMessages(prev => [...prev, streamingMessage])

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: message,
          source_language_code: 'auto',
          target_language_code: 'hi-IN',
          speaker_gender: 'Male'
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const fullResponse = data.answer || 'Sorry, I couldn\'t generate a response.'

      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: fullResponse, isStreaming: false }
            : msg
        )
      )

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId))
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const stopGeneration = () => {
    setIsLoading(false)
    setMessages(prev => prev.filter(msg => !msg.isStreaming))
  }

  return (
    <Card className={`w-full max-w-2xl mx-auto h-[600px] flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          {title}
          <div className="ml-auto flex gap-2">
            {isLoading && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={stopGeneration}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearChat}
              disabled={isLoading}
            >
              Clear Chat
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-medium">Welcome to Sarvam AI Assistant!</p>
                <p className="text-sm mt-1">Start a conversation to explore AI capabilities</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
                    )}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                    {message.isStreaming && (
                      <span className="ml-2 text-blue-500">Generating...</span>
                    )}
                  </p>
                </div>
                {message.isUser && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages.every(m => !m.isStreaming) && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
