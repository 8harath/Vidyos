import { NextRequest, NextResponse } from 'next/server'

// Demo responses for when API is not configured
const demoResponses = [
  "I'm currently running in demo mode. To get real AI responses, please configure your Dify API key. I can help you with various topics including technology, general knowledge, and problem-solving!",
  "This is a demonstration response. For full AI capabilities, please set up your Dify API configuration. I'm designed to assist with questions, provide explanations, and engage in helpful conversations.",
  "Demo mode is active! To unlock the full potential of this AI assistant, configure your Dify API settings. I can help with research, explanations, coding assistance, and much more!",
  "You're seeing a sample response since the API is in demo mode. Once properly configured with Dify, I'll provide intelligent, context-aware responses to all your questions and requests."
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Use environment variables for API configuration
    const apiKey = process.env.DIFY_API_KEY
    const baseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'
    const userPrefix = process.env.DIFY_USER_PREFIX || 'visitor'
    const publicAccess = process.env.DIFY_PUBLIC_ACCESS !== 'false'
    const demoMode = process.env.DEMO_MODE === 'true'
    const enableFallback = process.env.ENABLE_FALLBACK === 'true'
    
    // Check if public access is enabled
    if (!publicAccess) {
      return NextResponse.json(
        { error: 'Public access is disabled' },
        { status: 403 }
      )
    }
    
    const { query, conversationId, responseMode } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Handle demo mode
    if (demoMode || !apiKey) {
      const demoResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
      
      return NextResponse.json({
        answer: demoResponse,
        conversation_id: conversationId || `demo-${Date.now()}`,
        message_id: `demo-msg-${Date.now()}`,
        mode: 'demo',
        created_at: Math.floor(Date.now() / 1000)
      })
    }

    // Generate a unique user ID for this session
    const user = body.user || `${userPrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const response = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: responseMode || 'blocking',
        conversation_id: conversationId || '',
        user: user
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify API Error:', response.status, errorText)
      
      // Use fallback response if enabled
      if (enableFallback) {
        const fallbackResponse = "I'm having trouble connecting to my AI service right now, but I'm still here to help! This is a fallback response. Please try again in a moment, or contact support if the issue persists."
        
        return NextResponse.json({
          answer: fallbackResponse,
          conversation_id: conversationId || `fallback-${Date.now()}`,
          message_id: `fallback-msg-${Date.now()}`,
          mode: 'fallback',
          created_at: Math.floor(Date.now() / 1000)
        })
      }
      
      return NextResponse.json(
        { error: `AI service temporarily unavailable` },
        { status: 503 }
      )
    }

    // Handle streaming responses
    if (responseMode === 'streaming') {
      // For streaming, we need to pipe the response
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      })
    }

    // Handle blocking responses
    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('API Error:', error)
    
    const enableFallback = process.env.ENABLE_FALLBACK === 'true'
    
    // Use fallback response if enabled
    if (enableFallback) {
      const fallbackResponse = "I encountered an unexpected issue, but I'm still here to assist you! This is a fallback response while I resolve the technical difficulty. Please try again shortly."
      
      return NextResponse.json({
        answer: fallbackResponse,
        conversation_id: `error-fallback-${Date.now()}`,
        message_id: `error-msg-${Date.now()}`,
        mode: 'error-fallback',
        created_at: Math.floor(Date.now() / 1000)
      })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
