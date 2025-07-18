'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, User, Loader2, Languages } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatBotProps {
  title?: string
  placeholder?: string
  className?: string
}

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'tamil', label: 'Tamil' }
] as const

type Language = typeof LANGUAGES[number]['value']

const CHAT_HISTORY_KEY = 'vidyos-chat-history';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
      <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
      <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
      <span className="ml-2 text-sm text-gray-500">Vidyos is typing…</span>
    </div>
  );
}

export function ChatBot({ 
  title = 'Vidyos',
  placeholder = 'Type your message...',
  className = ''
}: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Load chat history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp back to Date
        if (Array.isArray(parsed)) {
          setMessages(parsed.map((msg) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        }
      } catch {}
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        CHAT_HISTORY_KEY,
        JSON.stringify(messages)
      );
    } else {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Prepare the query with language instruction
      let queryWithLanguage = message
      if (selectedLanguage !== 'english') {
        const languageNames = {
          telugu: 'Telugu',
          kannada: 'Kannada',
          tamil: 'Tamil'
        }
        queryWithLanguage = `Please respond in ${languageNames[selectedLanguage]} language. User query: ${message}`
      }

      const response = await fetch('/api/sarvam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: queryWithLanguage,
          conversationId: conversationId || undefined
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Update conversation ID if it's a new conversation
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id)
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || 'Sorry, I couldn\'t generate a response.',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('Error sending message:', error)
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
    setConversationId(null)
    localStorage.removeItem(CHAT_HISTORY_KEY)
  }

  return (
    <Card className={`w-full max-w-3xl mx-auto h-[700px] flex flex-col border-2 border-gray-800 bg-white shadow-2xl ${className}`}>
      <CardHeader className="flex-shrink-0 bg-black text-white border-b border-gray-800">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          {title}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-lg border border-gray-700">
              <Languages className="w-4 h-4 text-gray-300" />
              <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
                <SelectTrigger className="w-[130px] h-8 text-sm bg-transparent border-gray-600 text-white hover:bg-gray-800">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  {LANGUAGES.map((lang) => (
                    <SelectItem 
                      key={lang.value} 
                      value={lang.value}
                      className="text-white hover:bg-gray-800 focus:bg-gray-800"
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearChat}
              className="border-gray-600 text-white hover:bg-gray-800 hover:text-white bg-transparent"
            >
              Clear Chat
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 bg-gray-50">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          <AnimatePresence initial={false}>
            {messages.length === 0 && !isLoading && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="text-center text-gray-400 py-16"
              >
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">Welcome to Vidyos</h3>
                <p className="text-gray-500">Start a conversation with our AI assistant!</p>
              </motion.div>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <Avatar className="w-10 h-10 border-2 border-black shadow-md">
                    <AvatarFallback className="bg-black text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-xl transition-all duration-300 ${
                    message.isUser
                      ? 'bg-gradient-to-br from-black to-gray-800 text-white ml-auto'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.isUser ? (
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm max-w-none prose-gray">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-800">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
                          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                          code: ({ children }) => (
                            <code className="bg-gray-100 border border-gray-300 px-2 py-1 rounded text-xs font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-gray-100 border border-gray-300 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                              {children}
                            </pre>
                          ),
                          ul: ({ children }) => <ul className="list-disc list-inside mb-3 text-gray-800">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 text-gray-800">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  <p className="text-xs opacity-60 mt-2 font-medium text-right">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.isUser && (
                  <Avatar className="w-10 h-10 border-2 border-gray-400 shadow-md">
                    <AvatarFallback className="bg-gray-100 text-black">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 justify-start"
              >
                <Avatar className="w-10 h-10 border-2 border-black shadow-md">
                  <AvatarFallback className="bg-black text-white">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xl flex items-center gap-3 min-w-[120px]">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex gap-3 w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 text-black placeholder-gray-400 bg-white shadow-sm transition-all duration-200"
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="h-12 px-6 bg-black text-white rounded-xl hover:bg-gray-900 disabled:bg-gray-300 transition-colors shadow-md"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
