"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, User, Bot, Send } from "lucide-react"
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

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        "How do satellites stay in space?":
          "Great question! Think of satellites like a ball you throw. If you throw it gently, it falls down. But if you throw it really, really fast - so fast that by the time it falls, the Earth has curved away beneath it - it just keeps 'falling' around the Earth in a circle! Satellites go about 17,500 mph, which is the perfect speed to keep orbiting without falling down or flying away.",
        "What is quantum entanglement in simple terms?":
          "Imagine you have two magical coins that are connected no matter how far apart they are. When one coin lands on heads, the other instantly becomes tails - even if it's on the other side of the universe! That's kind of what quantum entanglement is like. Two particles become 'linked' and instantly affect each other, no matter the distance. It's like they're cosmic twins!",
        "How does the internet work?":
          "The internet is like a giant mail system for computers! When you send a message, it gets broken into tiny pieces called 'packets' - like tearing a letter into puzzle pieces. These pieces travel through cables, Wi-Fi, and fiber optic 'highways' to reach their destination, where they get put back together. Routers act like mail sorting offices, making sure each piece finds the right path to reach the other computer.",
        "Why is the sky blue?":
          "The sky is blue because of how sunlight bounces around in our atmosphere! Sunlight contains all colors mixed together, like a rainbow. When it hits tiny particles in the air, blue light gets scattered and bounced around much more than other colors - kind of like how a small ball bounces around more in a pinball machine. So we see blue light coming from all directions, making the whole sky look blue!",
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          responses[content as keyof typeof responses] ||
          `That's a fascinating question about "${content}"! I love curious minds like yours. Let me break this down in a simple way... Think of it like this: every complex topic has simple building blocks, just like how a big LEGO castle is made of individual bricks. Would you like me to explain any specific part of this topic in more detail? I'm here to help make even the most complex ideas crystal clear!`,
        role: "assistant",
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, aiResponse]
      setMessages(finalMessages)
      setIsTyping(false)
      
      // Update the chat with the AI response
      updateCurrentChat(finalMessages)
    }, 2000)
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
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                Your AI learning companion that explains complex topics in simple, understandable ways. Perfect for curious minds of all ages! 🧠✨
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
              className="retro-button text-left p-3 text-sm bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-2 border-gray-800 transition-all duration-300"
              style={{ boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3)" }}
              whileHover={{
                scale: 1.05,
                y: -2,
                x: -2,
              }}
              whileTap={{
                scale: 0.98,
                y: 1,
                x: 1,
              }}
              disabled={isTyping}
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
                      Hi there, curious learner! 👋 I'm Vidyos, your friendly AI companion who loves making complex topics simple and fun to understand. 
                      <br/><br/>
                      Think of me as your patient mentor who can explain anything - from how rockets work to why the ocean has waves - in ways that make perfect sense. Ready to explore something amazing together? 🚀
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
                placeholder="Ask me anything! I'll explain it simply..."
                disabled={isTyping}
                className="flex-1 px-3 py-2 border-2 border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 font-mono text-sm text-gray-900 placeholder-gray-600 transition-all duration-300 focus:from-white focus:to-white focus:border-purple-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.1)" }}
              />

              <motion.button
                type="submit"
                disabled={!currentInput.trim() || isTyping}
                className="retro-button px-4 py-2 flex items-center gap-2 text-sm bg-gradient-to-r from-purple-200 to-blue-200 hover:from-purple-300 hover:to-blue-300 border-2 border-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3)" }}
                whileHover={{
                  y: -2,
                  x: -2,
                }}
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
    </div>
  )
}
