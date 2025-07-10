"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, User, Bot, Send, Settings, Loader2 } from "lucide-react"
import Link from "next/link"

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

interface DifyConfig {
  apiKey: string
  baseUrl: string
  user: string
  conversationId?: string
}

const quickQuestions = [
  "How do satellites stay in space?",
  "What is quantum entanglement in simple terms?",
  "How does the internet work?",
  "Why is the sky blue?",
]

export default function VidyosChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chatData, setChatData] = useState<Record<string, ChatData>>({})
  const [difyConfig, setDifyConfig] = useState<DifyConfig | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
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

    // Load Dify configuration
    const savedDifyConfig = localStorage.getItem('vidyos-dify-config')
    if (savedDifyConfig) {
      try {
        const config = JSON.parse(savedDifyConfig)
        setDifyConfig(config)
        setIsConfigured(true)
      } catch (error) {
        console.error('Failed to parse Dify config:', error)
      }
    }
  }, [])

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

    // Check if Dify is configured
    if (!isConfigured || !difyConfig) {
      setShowConfig(true)
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
      // Call Dify API
      const response = await fetch(`${difyConfig.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${difyConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: content,
          response_mode: 'blocking',
          conversation_id: difyConfig.conversationId || '',
          user: difyConfig.user
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Update conversation ID if it's a new conversation
      if (data.conversation_id && !difyConfig.conversationId) {
        const updatedConfig = { ...difyConfig, conversationId: data.conversation_id }
        setDifyConfig(updatedConfig)
        localStorage.setItem('vidyos-dify-config', JSON.stringify(updatedConfig))
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
      console.error('Error calling Dify API:', error)
      
      // Fallback to friendly error message
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

  const handleConfigSave = (config: DifyConfig) => {
    setDifyConfig(config)
    setIsConfigured(true)
    setShowConfig(false)
    localStorage.setItem('vidyos-dify-config', JSON.stringify(config))
  }

  const resetConfig = () => {
    setDifyConfig(null)
    setIsConfigured(false)
    setShowConfig(true)
    localStorage.removeItem('vidyos-dify-config')
  }

  // Configuration Modal Component
  const ConfigModal = () => {
    const [tempConfig, setTempConfig] = useState<DifyConfig>(
      difyConfig || {
        apiKey: '',
        baseUrl: 'https://api.dify.ai/v1',
        user: 'user-' + Math.random().toString(36).substr(2, 9)
      }
    )
    const [isTestingConnection, setIsTestingConnection] = useState(false)

    const testConnection = async () => {
      if (!tempConfig.apiKey.trim()) {
        alert('Please enter an API key first')
        return
      }

      setIsTestingConnection(true)
      try {
        const response = await fetch(`${tempConfig.baseUrl}/chat-messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tempConfig.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {},
            query: 'Hello, this is a test message.',
            response_mode: 'blocking',
            conversation_id: '',
            user: tempConfig.user
          })
        })

        if (response.ok) {
          alert('Connection successful! 🎉')
        } else {
          const errorText = await response.text()
          alert(`Connection failed: ${response.status} - ${errorText}`)
        }
      } catch (error) {
        alert(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsTestingConnection(false)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white border-2 border-gray-800 p-6 max-w-md w-full shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configure Dify API
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input
                type="password"
                value={tempConfig.apiKey}
                onChange={(e) => setTempConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter your Dify API key"
                className="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Base URL</label>
              <input
                type="url"
                value={tempConfig.baseUrl}
                onChange={(e) => setTempConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                placeholder="https://api.dify.ai/v1"
                className="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <input
                type="text"
                value={tempConfig.user}
                onChange={(e) => setTempConfig(prev => ({ ...prev, user: e.target.value }))}
                placeholder="Unique user identifier"
                className="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleConfigSave(tempConfig)}
                disabled={!tempConfig.apiKey.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 border-2 border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Configuration
              </button>
              <button
                onClick={testConnection}
                disabled={isTestingConnection || !tempConfig.apiKey.trim()}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white border-2 border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTestingConnection ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Test'
                )}
              </button>
            </div>

            <button
              onClick={() => setShowConfig(false)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 border-2 border-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-3xl mx-auto px-4">
            {/* Header Section */}
            <header className="text-center mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-600 p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                      <Brain className="w-7 h-7 text-purple-600" />
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Vidyos
                      </span>
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setShowConfig(true)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 border-2 border-gray-800 transition-colors"
                    title="Configure Dify API"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <div className={`text-xs px-2 py-1 rounded border ${
                    isConfigured 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-red-100 border-red-300 text-red-800'
                  }`}>
                    {isConfigured ? 'API Connected' : 'API Not Set'}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                Your AI learning companion powered by Dify API that explains complex topics in simple, understandable ways. Perfect for curious minds of all ages! 🧠✨
              </p>
            </header>

            {/* Navigation */}
            <div className="text-center mb-6">
              <Link href="/chatbots">
                <motion.button
                  className="retro-button inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 border-2 border-gray-800 transition-all duration-300"
                  style={{ boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3)" }}
                  whileHover={{
                    boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.3)",
                    transform: "translate(-2px, -2px)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bot className="w-4 h-4" />
                  Dify AI Chatbots
                </motion.button>
              </Link>
            </div>

        {/* Quick Questions Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className={`retro-button text-left p-3 text-sm bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-2 border-gray-800 transition-all duration-300 ${
                !isConfigured || isTyping ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3)" }}
              whileHover={isConfigured && !isTyping ? {
                scale: 1.05,
                y: -2,
                x: -2,
              } : {}}
              whileTap={isConfigured && !isTyping ? {
                scale: 0.98,
                y: 1,
                x: 1,
              } : {}}
              disabled={!isConfigured || isTyping}
            >
              {question}
            </motion.button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="bg-gray-100 border-2 border-gray-800 p-4 shadow-lg">
          {/* Messages Area */}
          <div className="h-80 overflow-y-auto mb-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-gray-400 custom-scrollbar">
            <div className="space-y-4">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <motion.div
                    className="w-8 h-8 border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-200 to-blue-200 text-gray-800"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Bot className="w-4 h-4" />
                  </motion.div>
                  <motion.div
                    className="max-w-72 lg:max-w-96 border-2 border-gray-800 px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100"
                    style={{ boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.3)" }}
                  >
                    <p className="text-sm font-mono">
                      Hi there, curious learner! 👋 I'm Vidyos, your friendly AI companion powered by Dify API who loves making complex topics simple and fun to understand. 
                      <br/><br/>
                      {isConfigured ? (
                        <>Think of me as your patient mentor who can explain anything - from how rockets work to why the ocean has waves - in ways that make perfect sense. Ready to explore something amazing together? 🚀</>
                      ) : (
                        <>To get started, please click the <Settings className="w-4 h-4 inline mx-1" /> settings button in the header to configure your Dify API key. Once configured, I'll be ready to answer all your curious questions! 🔧</>
                      )}
                    </p>
                  </motion.div>
                </motion.div>
              )}
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <motion.div
                      className={`w-8 h-8 border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        message.role === "user" ? "bg-gradient-to-r from-green-200 to-emerald-200 text-gray-800" : "bg-gradient-to-r from-purple-200 to-blue-200 text-gray-800"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </motion.div>

                    {/* Message Bubble */}
                    <motion.div
                      className={`max-w-72 lg:max-w-96 border-2 border-gray-800 px-3 py-2 transition-all duration-300 ${
                        message.role === "user" ? "bg-gradient-to-r from-green-100 to-emerald-100 text-gray-900" : "bg-gradient-to-r from-purple-100 to-blue-100 text-gray-900"
                      }`}
                      style={{ boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.3)" }}
                      whileHover={{
                        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      <p className="text-sm font-mono">{message.content}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-3"
                  >
                    <motion.div
                      className="w-8 h-8 border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-200 to-blue-200 text-gray-800"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Bot className="w-4 h-4" />
                    </motion.div>

                    <div
                      className="max-w-72 lg:max-w-96 border-2 border-gray-800 px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100"
                      style={{ boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.3)" }}
                    >
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-amber-500 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Section */}
          <form onSubmit={handleSubmit} className="border-t-2 border-gray-400 pt-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder={isConfigured ? "Ask me anything! I'll explain it simply..." : "Configure API first..."}
                disabled={!isConfigured || isTyping}
                className="flex-1 px-3 py-2 border-2 border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 font-mono text-sm text-gray-900 placeholder-gray-600 transition-all duration-300 focus:from-white focus:to-white focus:border-purple-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.1)" }}
              />

              <motion.button
                type="submit"
                disabled={!isConfigured || !currentInput.trim() || isTyping}
                className="retro-button px-4 py-2 flex items-center gap-2 text-sm bg-gradient-to-r from-purple-200 to-blue-200 hover:from-purple-300 hover:to-blue-300 border-2 border-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3)" }}
                whileHover={isConfigured && !isTyping && currentInput.trim() ? {
                  y: -2,
                  x: -2,
                } : {}}
                whileTap={{
                  y: 1,
                  x: 1,
                }}
              >
                <Send className="w-4 h-4" />
                Send
              </motion.button>
            </div>
          </form>
        </div>

        {/* Footer Section */}
        <footer className="mt-6 text-center">
          <div className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 border border-gray-400 px-3 py-1 rounded-lg">
            <p className="text-xs text-gray-600 font-mono">
              🤖 Vidyos • Making complex topics simple for curious minds
            </p>
          </div>
        </footer>
      </div>
      
      {/* Configuration Modal */}
      {showConfig && <ConfigModal />}
    </div>
  )
}
