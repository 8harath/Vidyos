# Dify AI Chatbot Integration

This project includes a complete integration with the Dify API to create conversational AI chatbots. The integration provides both streaming and blocking response modes with a modern, responsive UI.

## Features

- ✅ **Streaming Responses**: Real-time text generation with typing indicators
- ✅ **Blocking Responses**: Traditional request-response pattern
- ✅ **Conversation History**: Maintains conversation context with conversation IDs
- ✅ **Modern UI**: Beautiful chat interface with shadcn/ui components
- ✅ **Configuration Management**: Easy setup with API key management
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **TypeScript Support**: Full type safety and IntelliSense
- ✅ **Local Storage**: Persistent configuration and chat history

## Components

### 1. StreamingChatBot
A real-time streaming chatbot that shows responses as they're generated.

```tsx
import { StreamingChatBot } from '@/components/streaming-chat-bot'

<StreamingChatBot
  apiKey="your-dify-api-key"
  baseUrl="https://api.dify.ai/v1"
  user="unique-user-id"
  title="My AI Assistant"
  placeholder="Ask me anything..."
/>
```

### 2. ChatBot
A traditional chatbot that waits for complete responses before displaying them.

```tsx
import { ChatBot } from '@/components/chat-bot'

<ChatBot
  apiKey="your-dify-api-key"
  baseUrl="https://api.dify.ai/v1"
  user="unique-user-id"
  title="My AI Assistant"
  placeholder="Ask me anything..."
/>
```

### 3. DifyConfig
A configuration component for managing API settings.

```tsx
import { DifyConfig } from '@/components/dify-config'

<DifyConfig
  onConfigSave={(config) => {
    // Handle configuration save
    console.log('Config saved:', config)
  }}
  initialConfig={{
    apiKey: '',
    baseUrl: 'https://api.dify.ai/v1',
    user: 'user-123'
  }}
/>
```

## Setup Instructions

### 1. Create a Dify Application

1. Go to your [Dify dashboard](https://dify.ai/)
2. Create a new **Conversational Application**
3. Configure your application with:
   - System prompt
   - Model selection (GPT-4, Claude, etc.)
   - Knowledge base (optional)
   - Tools and plugins (optional)

### 2. Get API Credentials

1. Navigate to your application
2. Go to **Applications** → **Access API**
3. Create a new API key
4. Copy the API key for use in your application

### 3. Configure the Chatbot

1. Visit `/chatbot` in your application
2. Enter your API key and configuration
3. Test the connection
4. Start chatting!

## API Configuration

### Required Settings

- **API Key**: Your Dify application API key
- **Base URL**: The Dify API endpoint (default: `https://api.dify.ai/v1`)
- **User ID**: A unique identifier for conversation tracking

### Optional Settings

- **Response Mode**: Choose between `streaming` and `blocking`
- **Custom Title**: Set a custom title for your chatbot
- **Placeholder Text**: Customize the input placeholder

## Usage Examples

### Basic Usage

```tsx
'use client'

import { useState } from 'react'
import { StreamingChatBot } from '@/components/streaming-chat-bot'

export default function MyChat() {
  return (
    <div className="container mx-auto p-4">
      <StreamingChatBot
        apiKey="your-api-key-here"
        user="user-123"
        title="Customer Support Bot"
        placeholder="How can I help you today?"
      />
    </div>
  )
}
```

### With Configuration Management

```tsx
'use client'

import { useState, useEffect } from 'react'
import { StreamingChatBot } from '@/components/streaming-chat-bot'
import { DifyConfig } from '@/components/dify-config'

export default function ConfigurableChat() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('dify-config')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleConfigSave = (newConfig) => {
    setConfig(newConfig)
    localStorage.setItem('dify-config', JSON.stringify(newConfig))
  }

  if (!config) {
    return <DifyConfig onConfigSave={handleConfigSave} />
  }

  return (
    <StreamingChatBot
      apiKey={config.apiKey}
      baseUrl={config.baseUrl}
      user={config.user}
    />
  )
}
```

## Security Best Practices

### 1. API Key Security
- Never expose API keys in client-side code for production
- Use environment variables for API keys
- Consider using a backend proxy for API calls

### 2. Server-Side Proxy (Recommended)
Use the included API route for secure API calls:

```tsx
// Use the server route instead of direct API calls
const response = await fetch('/api/dify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: process.env.DIFY_API_KEY, // Server-side only
    baseUrl: 'https://api.dify.ai/v1',
    query: userMessage,
    conversationId: currentConversationId,
    user: userId
  })
})
```

### 3. User Authentication
- Implement proper user authentication
- Use unique user IDs for conversation tracking
- Validate user permissions before API calls

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify your API key is correct
   - Check if the API key has proper permissions
   - Ensure the key is for the correct application

2. **Connection Failed**
   - Check your internet connection
   - Verify the base URL is correct
   - Check if Dify service is operational

3. **No Response**
   - Ensure your Dify application is properly configured
   - Check if the application has a valid model selected
   - Verify the application is published and active

### Debug Mode
Enable debug mode to see detailed API responses:

```tsx
<StreamingChatBot
  apiKey={apiKey}
  // ... other props
  onError={(error) => console.error('Chat error:', error)}
  onMessage={(message) => console.log('New message:', message)}
/>
```

## Customization

### Styling
The components use Tailwind CSS and can be customized:

```tsx
<StreamingChatBot
  className="custom-chat-styles"
  // ... other props
/>
```

### Custom Themes
Modify the component styles by editing the CSS classes or using CSS-in-JS:

```css
.custom-chat-styles {
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
}
```

### Event Handling
Add custom event handlers:

```tsx
<StreamingChatBot
  onMessageSent={(message) => {
    // Track analytics
    analytics.track('message_sent', { message })
  }}
  onResponseReceived={(response) => {
    // Handle response
    console.log('AI response:', response)
  }}
/>
```

## Advanced Features

### Conversation Management
- Automatic conversation ID generation
- Conversation history persistence
- Multiple conversation support

### Response Modes
- **Streaming**: Real-time response generation
- **Blocking**: Complete response delivery

### Error Recovery
- Automatic retry on network errors
- Graceful degradation on API failures
- User-friendly error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
