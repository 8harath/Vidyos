import { NextRequest, NextResponse } from 'next/server'
import { SarvamAI } from 'sarvamai'

// Demo responses for when API is not configured
const demoResponses = [
  "I'm currently running in demo mode. To get real AI responses, please configure your Sarvam AI API key. I can help you with various topics including technology, general knowledge, and problem-solving!",
  "This is a demonstration response. For full AI capabilities, please set up your Sarvam AI API configuration. I'm designed to assist with questions, provide explanations, and engage in helpful conversations.",
  "Demo mode is active! To unlock the full potential of this AI assistant, configure your Sarvam AI API settings. I can help with research, explanations, coding assistance, and much more!",
  "You're seeing a sample response since the API is in demo mode. Once properly configured with Sarvam AI, I'll provide intelligent, context-aware responses to all your questions and requests."
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Use environment variables for API configuration
    const apiKey = process.env.SARVAM_API_KEY
    const publicAccess = process.env.PUBLIC_ACCESS !== 'false'
    const demoMode = process.env.DEMO_MODE === 'true'
    const enableFallback = process.env.ENABLE_FALLBACK === 'true'

    // Check if public access is enabled
    if (!publicAccess) {
      return NextResponse.json(
        { error: 'Public access is disabled' },
        { status: 403 }
      )
    }

    const { input, source_language_code, target_language_code, speaker_gender } = body

    if (!input) {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      )
    }

    // Handle demo mode
    if (demoMode || !apiKey) {
      const demoResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
      return NextResponse.json({
        answer: demoResponse,
        conversation_id: `demo-${Date.now()}`,
        message_id: `demo-msg-${Date.now()}`,
        mode: 'demo',
        created_at: Math.floor(Date.now() / 1000)
      })
    }

    // Initialize Sarvam AI
    const client = new SarvamAI({ api_subscription_key: apiKey })
    try {
      const response = await client.text.translate({
        input,
        source_language_code: source_language_code || 'auto',
        target_language_code: target_language_code || 'hi-IN',
        speaker_gender: speaker_gender || 'Male'
      })

      return NextResponse.json({
        answer: response,
        conversation_id: `sarvam-${Date.now()}`,
        message_id: `sarvam-msg-${Date.now()}`,
        mode: 'sarvam',
        created_at: Math.floor(Date.now() / 1000)
      })
    } catch (sarvamError) {
      console.error('Sarvam AI Error:', sarvamError)
      if (enableFallback) {
        const fallbackResponse = "I'm having trouble connecting to Sarvam AI right now, but I'm still here to help! This is a fallback response. Please try again in a moment, or contact support if the issue persists."
        return NextResponse.json({
          answer: fallbackResponse,
          conversation_id: `fallback-${Date.now()}`,
          message_id: `fallback-msg-${Date.now()}`,
          mode: 'fallback',
          created_at: Math.floor(Date.now() / 1000)
        })
      }
      return NextResponse.json(
        { error: `Sarvam AI service temporarily unavailable` },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('API Error:', error)
    const enableFallback = process.env.ENABLE_FALLBACK === 'true'
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