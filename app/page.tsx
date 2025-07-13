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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 flex items-center justify-center gap-4">
              <Brain className="w-10 h-10 md:w-12 md:h-12 text-gray-900" />
              Vidyos
              <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium border ${
                isApiAvailable 
                  ? 'bg-gray-100 text-gray-800 border-gray-300' 
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}>
                {isCheckingApi ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : isApiAvailable ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    <span>Ready</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>Connecting</span>
                  </div>
                )}
              </div>
            </h1>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              AI-powered assistant for intelligent conversations
            </p>
            
            {apiError && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span className="font-medium">Connection Issue:</span>
                </div>
                <p className="mt-1">{apiError}</p>
              </div>
            )}
          </div>
        </header>

        {/* Quick Questions Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className={`text-left p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200 ${
                  !isApiAvailable || isTyping ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isApiAvailable || isTyping}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-800 font-medium">{question}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gray-900 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Vidyos Assistant</h3>
                <p className="text-gray-300 text-sm">AI-powered chat</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="max-w-sm bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <p className="text-gray-800 leading-relaxed">
                      {isApiAvailable ? (
                        <>Hello! I'm Vidyos, your AI assistant. How can I help you today?</>
                      ) : (
                        <>Connecting to AI service...<//>
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" 
                      ? "bg-gray-700" 
                      : "bg-gray-900"
                  }`}>
                    {message.role === "user" ? 
                      <User className="w-5 h-5 text-white" /> : 
                      <Bot className="w-5 h-5 text-white" />
                    }
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-sm lg:max-w-md p-4 rounded-lg shadow-sm border ${
                    message.role === "user" 
                      ? "bg-gray-900 text-white border-gray-800" 
                      : "bg-white text-gray-800 border-gray-200"
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-2 ${
                      message.role === "user" ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
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
          <div className="p-6 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={isApiAvailable ? "Type your message..." : "Connecting..."}
                  disabled={!isApiAvailable || isTyping}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-500 focus:bg-white focus:border-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <button
                  type="submit"
                  disabled={!isApiAvailable || !currentInput.trim() || isTyping}
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by Vidyos AI
          </p>
        </footer>
      </div>
    </div>
  )
}
