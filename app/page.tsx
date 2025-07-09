"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, User, Bot, Send } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const quickQuestions = [
  "Tell me about Bharath's AI/ML projects",
  "What technologies does Bharath work with?",
  "What are Bharath's research interests?",
  "How can I contact Bharath?",
]

export default function AreteChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        "Tell me about Bharath's AI/ML projects":
          "Bharath has worked on several cutting-edge AI/ML projects including neural network optimization, computer vision applications, and natural language processing systems. His portfolio includes projects in deep learning, reinforcement learning, and MLOps pipelines.",
        "What technologies does Bharath work with?":
          "Bharath is proficient in Python, TensorFlow, PyTorch, scikit-learn, Docker, Kubernetes, AWS, and various data engineering tools. He also works with React, Node.js, and modern web technologies for full-stack development.",
        "What are Bharath's research interests?":
          "Bharath's research focuses on explainable AI, federated learning, and ethical AI systems. He's particularly interested in making AI more interpretable and accessible while ensuring fairness and privacy in machine learning models.",
        "How can I contact Bharath?":
          "You can reach Bharath through his LinkedIn profile, GitHub repositories, or via email. He's always open to discussing AI research, collaboration opportunities, and innovative projects in the field of artificial intelligence.",
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          responses[content as keyof typeof responses] ||
          `That's an interesting question about "${content}". Bharath has extensive experience in AI/ML and would be happy to discuss this topic further. His expertise spans multiple domains including machine learning, deep learning, and AI system architecture.`,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(currentInput)
  }

  return (
    <div className="min-h-screen py-8 bg-amber-50">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header Section */}
        <header className="text-center mb-8">
          <div className="inline-block bg-amber-100 border-2 border-amber-600 p-6 mb-4">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
              <Brain className="w-7 h-7 text-red-600" />
              Arete AI Assistant
            </h1>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Ask me about Bharath's projects, skills, research, or experience.
          </p>
        </header>

        {/* Quick Questions Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="retro-button text-left p-3 text-sm bg-gray-200 hover:bg-amber-300 border-2 border-gray-800 transition-all duration-300"
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
          <div className="h-80 overflow-y-auto mb-4 p-4 bg-amber-50 border-2 border-gray-400 custom-scrollbar">
            <div className="space-y-4">
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
                        message.role === "user" ? "bg-amber-300 text-gray-800" : "bg-gray-200 text-gray-800"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </motion.div>

                    {/* Message Bubble */}
                    <motion.div
                      className={`max-w-72 lg:max-w-96 border-2 border-gray-800 px-3 py-2 transition-all duration-300 ${
                        message.role === "user" ? "bg-amber-200 text-gray-900" : "bg-gray-100 text-gray-900"
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
                      className="w-8 h-8 border-2 border-gray-800 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-800"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Bot className="w-4 h-4" />
                    </motion.div>

                    <div
                      className="max-w-72 lg:max-w-96 border-2 border-gray-800 px-3 py-2 bg-gray-100"
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
                placeholder="Ask me about Bharath..."
                disabled={isTyping}
                className="flex-1 px-3 py-2 border-2 border-gray-800 bg-amber-50 font-mono text-sm text-gray-900 placeholder-gray-600 transition-all duration-300 focus:bg-white focus:border-amber-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.1)" }}
              />

              <motion.button
                type="submit"
                disabled={!currentInput.trim() || isTyping}
                className="retro-button px-4 py-2 flex items-center gap-2 text-sm bg-gray-200 hover:bg-amber-300 border-2 border-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="inline-block bg-amber-100 border border-gray-400 px-3 py-1">
            <p className="text-xs text-gray-600 font-mono">
              🤖 Arete AI Assistant • Powered by Bharath's knowledge base
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
