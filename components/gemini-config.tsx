'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Eye, EyeOff, Bot, Settings } from 'lucide-react'

interface GeminiConfigProps {
  onConfigSave?: (config: GeminiConfig) => void
  className?: string
}

export interface GeminiConfig {
  apiKey: string
  model: string
  demoMode: boolean
  enableFallback: boolean
}

const GEMINI_MODELS = [
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Fast)' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Advanced)' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
]

export function GeminiConfig({ onConfigSave, className = '' }: GeminiConfigProps) {
  const [config, setConfig] = useState<GeminiConfig>({
    apiKey: '',
    model: 'gemini-1.5-flash',
    demoMode: false,
    enableFallback: true
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!config.demoMode && !config.apiKey.trim()) {
      toast({
        title: "Validation Error",
        description: "API key is required when demo mode is disabled",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Test the configuration with a simple request
      if (!config.demoMode && config.apiKey.trim()) {
        const testResponse = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: 'Hello, this is a test message',
            testMode: true
          })
        })

        if (!testResponse.ok) {
          throw new Error('Failed to validate API configuration')
        }
      }

      onConfigSave?.(config)
      
      toast({
        title: "Configuration Saved",
        description: "Your Gemini API configuration has been saved successfully!",
      })
    } catch (error) {
      console.error('Config validation error:', error)
      toast({
        title: "Configuration Error",
        description: error instanceof Error ? error.message : "Failed to validate configuration",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setConfig({
      apiKey: '',
      model: 'gemini-1.5-flash',
      demoMode: false,
      enableFallback: true
    })
    setShowApiKey(false)
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Gemini Configuration
        </CardTitle>
        <CardDescription>
          Configure your Google Gemini API settings for the chatbot
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="demo-mode">Demo Mode</Label>
            <Switch
              id="demo-mode"
              checked={config.demoMode}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, demoMode: checked }))
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Enable demo mode to test without an API key
          </p>
        </div>

        {!config.demoMode && (
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your Gemini API key"
                value={config.apiKey}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, apiKey: e.target.value }))
                }
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your API key from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select
            value={config.model}
            onValueChange={(value) => 
              setConfig(prev => ({ ...prev, model: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {GEMINI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-fallback">Enable Fallback</Label>
            <Switch
              id="enable-fallback"
              checked={config.enableFallback}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, enableFallback: checked }))
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Show fallback responses when the API is unavailable
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={isLoading}
          className="flex-1"
        >
          Reset
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Bot className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Save Config
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
