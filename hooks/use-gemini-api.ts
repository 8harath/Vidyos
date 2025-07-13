'use client'

import { useState, useCallback } from 'react'

interface UseGeminiApiOptions {
  apiKey?: string
  model?: string
  useServerRoute?: boolean
}

interface SendMessageOptions {
  query: string
  conversationId?: string
  responseMode?: 'blocking' | 'streaming'
  onStream?: (chunk: string) => void
}

export function useGeminiApi({ 
  apiKey, 
  model = 'gemini-1.5-flash',
  useServerRoute = true
}: UseGeminiApiOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async ({ 
    query, 
    conversationId, 
    responseMode = 'blocking',
    onStream 
  }: SendMessageOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = useServerRoute 
        ? '/api/gemini' 
        : '/api/gemini'

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const body = JSON.stringify({ 
        apiKey, 
        model, 
        query, 
        conversationId, 
        responseMode 
      })

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      // Handle streaming responses
      if (responseMode === 'streaming') {
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let fullContent = ''
        let conversationIdFromStream = conversationId

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.event === 'message' && data.answer) {
                  const newContent = data.answer
                  fullContent += newContent
                  onStream?.(newContent)
                }
                
                if (data.event === 'message_end' && data.conversation_id) {
                  conversationIdFromStream = data.conversation_id
                }
              } catch (e) {
                // Skip malformed JSON
                continue
              }
            }
          }
        }

        return {
          answer: fullContent,
          conversation_id: conversationIdFromStream
        }
      }

      // Handle blocking responses
      const data = await response.json()
      return data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [apiKey, model, useServerRoute])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    sendMessage,
    isLoading,
    error,
    clearError
  }
}
