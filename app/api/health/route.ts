import { NextRequest, NextResponse } from 'next/server'

interface ServiceStatus {
  name: string
  status: string
  response_time?: string
  last_check: string
  error?: string
}

interface HealthCheck {
  status: string
  timestamp: string
  version: string
  environment: string
  config: {
    apiKeyConfigured: boolean
    baseUrl: string
    demoMode: boolean
    fallbackEnabled: boolean
    publicAccess: boolean
  }
  services: {
    api: string
    database: string
    external_services: ServiceStatus[]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const apiKey = process.env.DIFY_API_KEY
    const baseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'
    const demoMode = process.env.DEMO_MODE === 'true'
    const enableFallback = process.env.ENABLE_FALLBACK === 'true'
    const publicAccess = process.env.DIFY_PUBLIC_ACCESS !== 'false'

    // Health check data
    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      config: {
        apiKeyConfigured: !!apiKey,
        baseUrl: baseUrl,
        demoMode: demoMode,
        fallbackEnabled: enableFallback,
        publicAccess: publicAccess
      },
      services: {
        api: 'unknown',
        database: 'not_required',
        external_services: []
      }
    }

    // Test Dify API if key is configured
    if (apiKey && !demoMode) {
      try {
        const testResponse = await fetch(`${baseUrl}/chat-messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {},
            query: 'health check',
            response_mode: 'blocking',
            conversation_id: '',
            user: 'health-check-user'
          })
        })

        healthCheck.services.api = testResponse.ok ? 'healthy' : 'degraded'
        healthCheck.services.external_services.push({
          name: 'dify_api',
          status: testResponse.ok ? 'healthy' : 'unhealthy',
          response_time: 'measured',
          last_check: new Date().toISOString()
        })
      } catch (error) {
        healthCheck.services.api = 'unhealthy'
        healthCheck.services.external_services.push({
          name: 'dify_api',
          status: 'unhealthy',
          error: 'connection_failed',
          last_check: new Date().toISOString()
        })
      }
    } else {
      healthCheck.services.api = demoMode ? 'demo_mode' : 'not_configured'
    }

    // Overall status
    if (!apiKey && !demoMode) {
      healthCheck.status = 'degraded'
    } else if (healthCheck.services.api === 'unhealthy') {
      healthCheck.status = 'degraded'
    }

    return NextResponse.json(healthCheck, {
      status: healthCheck.status === 'healthy' ? 200 : 503
    })

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Internal server error during health check'
    }, { status: 500 })
  }
}
