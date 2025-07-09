"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Calendar,
  Brain,
  Clock
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

interface ChatSidebarProps {
  onNewChat: () => void
  onLoadChat: (chatId: string) => void
  currentChatId?: string
  onDeleteChat: (chatId: string) => void
  chatSessions: ChatSession[]
}

export function ChatSidebar({ 
  onNewChat, 
  onLoadChat, 
  currentChatId,
  onDeleteChat,
  chatSessions: propChatSessions
}: ChatSidebarProps) {
  // Use the chat sessions passed from parent instead of managing them here
  const chatSessions = propChatSessions

  const handleNewChat = () => {
    onNewChat()
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return timestamp.toLocaleDateString()
    }
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  // Group sessions by date
  const groupedSessions = chatSessions.reduce((groups, session) => {
    const today = new Date()
    const sessionDate = session.timestamp
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
    
    let groupKey: string
    if (diffDays === 0) {
      groupKey = 'Today'
    } else if (diffDays === 1) {
      groupKey = 'Yesterday'
    } else if (diffDays < 7) {
      groupKey = 'This Week'
    } else if (diffDays < 30) {
      groupKey = 'This Month'
    } else {
      groupKey = 'Older'
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(session)
    return groups
  }, {} as Record<string, ChatSession[]>)

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-2 px-2 py-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Vidyos
          </span>
        </div>
        
        <Button
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-purple-200 to-blue-200 hover:from-purple-300 hover:to-blue-300 border-2 border-gray-800 text-gray-800 font-mono"
          style={{ boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.3)" }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {Object.entries(groupedSessions).map(([groupName, sessions]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel className="text-gray-600 font-mono text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group relative"
                    >
                      <SidebarMenuButton
                        onClick={() => onLoadChat(session.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                          currentChatId === session.id
                            ? 'bg-gradient-to-r from-purple-200 to-blue-200 border-purple-400'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:from-amber-100 hover:to-orange-100'
                        }`}
                        style={{ boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-gray-600" />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm font-medium text-gray-800 mb-1">
                              {truncateText(session.title)}
                            </div>
                            <div className="font-mono text-xs text-gray-600 mb-1">
                              {truncateText(session.lastMessage, 40)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(session.timestamp)}
                              <span className="ml-auto">
                                {session.messageCount} msgs
                              </span>
                            </div>
                          </div>
                        </div>
                      </SidebarMenuButton>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteChat(session.id)
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-red-100 hover:bg-red-200 border border-red-300"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </motion.div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        {chatSessions.length === 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="text-center p-6 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-mono text-sm">No chats yet</p>
                <p className="font-mono text-xs mt-1">Start a conversation to see it here!</p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
