import { NextResponse } from 'next/server'

export async function GET() {
  // Check if the required environment variables are set
  const apiKey = process.env.DIFY_API_KEY
  const baseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'

  if (!apiKey) {
    return NextResponse.json(
      { error: 'DIFY_API_KEY environment variable is not set' },
      { status: 500 }
    )
  }

  return NextResponse.json({ 
    configured: true,
    baseUrl: baseUrl
  })
}
