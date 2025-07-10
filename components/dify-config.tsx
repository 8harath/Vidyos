'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Save, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface DifyConfigProps {
  onConfigSave: (config: DifyConfig) => void
  initialConfig?: DifyConfig
}

export interface DifyConfig {
  apiKey: string
  baseUrl: string
  user: string
}

export function DifyConfig({ onConfigSave, initialConfig }: DifyConfigProps) {
  const [config, setConfig] = useState<DifyConfig>(
    initialConfig || {
      apiKey: '',
      baseUrl: 'https://api.dify.ai/v1',
      user: 'user-' + Math.random().toString(36).substr(2, 9)
    }
  )
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    if (!config.apiKey.trim()) {
      toast({
        title: "Error",
        description: "API Key is required",
        variant: "destructive"
      })
      return
    }

    if (!config.baseUrl.trim()) {
      toast({
        title: "Error",
        description: "Base URL is required",
        variant: "destructive"
      })
      return
    }

    onConfigSave(config)
    toast({
      title: "Success",
      description: "Configuration saved successfully"
    })
  }

  const testConnection = async () => {
    if (!config.apiKey.trim()) {
      toast({
        title: "Error",
        description: "API Key is required to test connection",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${config.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: 'Hello, this is a test message.',
          response_mode: 'blocking',
          conversation_id: '',
          user: config.user
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Connection test successful!"
        })
      } else {
        const errorText = await response.text()
        toast({
          title: "Connection Failed",
          description: `${response.status}: ${errorText}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Dify API Configuration
        </CardTitle>
        <CardDescription>
          Configure your Dify API settings to connect the chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="flex gap-2">
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter your Dify API key"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key from your Dify application settings
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="baseUrl">Base URL</Label>
          <Input
            id="baseUrl"
            type="url"
            value={config.baseUrl}
            onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
            placeholder="https://api.dify.ai/v1"
          />
          <p className="text-xs text-muted-foreground">
            Default: https://api.dify.ai/v1 (use your own if self-hosted)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user">User ID</Label>
          <Input
            id="user"
            value={config.user}
            onChange={(e) => setConfig(prev => ({ ...prev, user: e.target.value }))}
            placeholder="Unique user identifier"
          />
          <p className="text-xs text-muted-foreground">
            A unique identifier for tracking conversations
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
          <Button 
            variant="outline" 
            onClick={testConnection}
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Test'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
