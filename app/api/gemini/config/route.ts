import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
    const demoMode = process.env.DEMO_MODE === 'true'
    const enableFallback = process.env.ENABLE_FALLBACK !== 'false'

    if (demoMode || !apiKey) {
      return NextResponse.json({
        demoMode: true,
        model,
        enableFallback
      })
    }

    return NextResponse.json({
      demoMode: false,
      model,
      enableFallback,
      configured: true
    })

  } catch (error) {
    console.error('Config API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
