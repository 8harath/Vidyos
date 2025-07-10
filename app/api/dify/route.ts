import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Use environment variables for API configuration
    const apiKey = process.env.DIFY_API_KEY
    const baseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'
    const userPrefix = process.env.DIFY_USER_PREFIX || 'visitor'
    const publicAccess = process.env.DIFY_PUBLIC_ACCESS !== 'false'
    
    // Check if public access is enabled
    if (!publicAccess) {
      return NextResponse.json(
        { error: 'Public access is disabled' },
        { status: 403 }
      )
    }
    
    // Validate API key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: DIFY_API_KEY is not set' },
        { status: 500 }
      )
    }

    const { query, conversationId, responseMode } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
