import { NextResponse } from 'next/server'

export async function GET() {
  // Check if the required environment variables are set
  const apiKey = process.env.DIFY_API_KEY
  const baseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'
  const demoMode = process.env.DEMO_MODE === 'true'
  const enableFallback = process.env.ENABLE_FALLBACK === 'true'

  if (!apiKey && !demoMode) {
    return NextResponse.json(
      { 
        error: 'DIFY_API_KEY environment variable is not set',
        suggestion: 'Please set up your Dify API key or enable demo mode'
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ 
    configured: true,
    baseUrl: baseUrl,
    demoMode: demoMode,
    fallbackEnabled: enableFallback,
    apiKeySet: !!apiKey
  })
}
