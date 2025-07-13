"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Brain, User, Bot, Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatData {
  id: string
  messages: Message[]
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

const quickQuestions = [
  "How does artificial intelligence work?",
  "What is machine learning?",
]

export default function VidyosChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chatData, setChatData] = useState<Record<string, ChatData>>({})
  const [isApiAvailable, setIsApiAvailable] = useState(false)
  const [isCheckingApi, setIsCheckingApi] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Load chat data from localStorage on component mount
  useEffect(() => {
    const savedChatData = localStorage.getItem('vidyos-chat-data')
    if (savedChatData) {
      const parsedData = JSON.parse(savedChatData)
      // Convert timestamp strings back to Date objects
      Object.keys(parsedData).forEach(chatId => {
        parsedData[chatId].timestamp = new Date(parsedData[chatId].timestamp)
        parsedData[chatId].messages.forEach((msg: any) => {
          msg.timestamp = new Date(msg.timestamp)
        })
      })
      setChatData(parsedData)
    }

    // Check if server-side API is available
    checkApiAvailability()
  }, [])

  const checkApiAvailability = async () => {
    try {
      const response = await fetch('/api/dify/config')
      if (response.ok) {
        setIsApiAvailable(true)
        setApiError(null)
      } else {
        const errorData = await response.json()
        setIsApiAvailable(false)
        setApiError(errorData.error || 'API configuration error')
      }
    } catch (error) {
      setIsApiAvailable(false)
      setApiError('Unable to connect to server')
    } finally {
      setIsCheckingApi(false)
    }
  }

  // Save chat data to localStorage whenever chatData changes
  useEffect(() => {
    localStorage.setItem('vidyos-chat-data', JSON.stringify(chatData))
  }, [chatData])

  const generateChatTitle = (firstMessage: string): string => {
    const title = firstMessage.substring(0, 40)
    return title.length < firstMessage.length ? title + '...' : title
  }

  const createNewChat = () => {
    const newChatId = Date.now().toString()
    setCurrentChatId(newChatId)
    setMessages([])
    
    const newChatData: ChatData = {
      id: newChatId,
      messages: [],
      title: "New Chat",
      lastMessage: "",
      timestamp: new Date(),
      messageCount: 0
    }
    
    setChatData(prev => ({
      ...prev,
      [newChatId]: newChatData
    }))
  }

  const loadChat = (chatId: string) => {
    const chat = chatData[chatId]
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
    }
  }

  const deleteChat = (chatId: string) => {
    setChatData(prev => {
      const newData = { ...prev }
      delete newData[chatId]
      return newData
    })
    
    // If the deleted chat was the current one, create a new chat
    if (currentChatId === chatId) {
      createNewChat()
    }
  }

  const updateCurrentChat = (newMessages: Message[]) => {
    if (!currentChatId) return
    
    const lastMessage = newMessages[newMessages.length - 1]
    const title = newMessages.length === 1 ? generateChatTitle(newMessages[0].content) : chatData[currentChatId]?.title || "New Chat"
    
    setChatData(prev => ({
      ...prev,
      [currentChatId]: {
        id: currentChatId,
        messages: newMessages,
        title,
        lastMessage: lastMessage?.content || "",
        timestamp: new Date(),
        messageCount: newMessages.length
      }
    }))
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Check if API is available
    if (!isApiAvailable) {
      setApiError('API is not available. Please check server configuration.')
      return
    }

    // Create new chat if none exists
    if (!currentChatId) {
      createNewChat()
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setCurrentInput("")
    setIsTyping(true)

    // Update the current chat with the new message
    updateCurrentChat(updatedMessages)

    try {
      // Call server-side API
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: content,
          conversationId: conversationId || '',
          responseMode: 'blocking',
          user: `visitor-${Date.now()}`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      // Update conversation ID if it's a new conversation
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id)
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || 'Sorry, I couldn\'t generate a response.',
        role: "assistant",
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, aiResponse]
      setMessages(finalMessages)
      setIsTyping(false)
      
      // Update the chat with the AI response
      updateCurrentChat(finalMessages)

    } catch (error) {
      console.error('Error calling API:', error)
      
      // Show user-friendly error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm having trouble connecting to my AI brain right now. ${error instanceof Error ? error.message : 'Please try again later.'} 🤔`,
        role: "assistant",
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, errorResponse]
      setMessages(finalMessages)
      setIsTyping(false)
      
      // Update the chat with the error response
      updateCurrentChat(finalMessages)
    }
  }

  // Initialize with a new chat if no chat exists
  useEffect(() => {
    if (Object.keys(chatData).length === 0) {
      createNewChat()
    }
  }, [])

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(currentInput)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Section */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-black mb-2 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-black" />
            Vidyos
          </h1>
          
          {apiError && (
            <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm">
              <span className="font-medium">Connection Issue:</span> {apiError}
            </div>
          )}
        </header>

        {/* Quick Questions Section */}
        {messages.length === 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className={`text-left p-3 border border-gray-300 hover:border-black transition-colors duration-200 ${
                    !isApiAvailable || isTyping ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isApiAvailable || isTyping}
                >
                  <span className="text-black">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" 
                      ? "bg-black text-white" 
                      : "bg-gray-200 text-black"
                  }`}>
                    {message.role === "user" ? 
                      <User className="w-4 h-4" /> : 
                      <Bot className="w-4 h-4" />
                    }
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-md p-3 border ${
                    message.role === "user" 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-black border-gray-300"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 text-black flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-300 p-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Section */}
          <div className="p-4 bg-white border-t border-gray-300">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={isApiAvailable ? "Type your message..." : "Connecting..."}
                  disabled={!isApiAvailable || isTyping}
                  className="flex-1 px-3 py-2 border border-gray-300 text-black placeholder-gray-500 focus:border-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <button
                  type="submit"
                  disabled={!isApiAvailable || !currentInput.trim() || isTyping}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
