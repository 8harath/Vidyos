# Sarvam AI Integration Guide

This guide explains how to integrate Sarvam AI into your Vidyos chatbot application.

## 1. Prerequisites

- Sarvam AI API key (get it from your Sarvam AI dashboard)
- Node.js 18.x or higher
- npm or pnpm package manager

## 2. Environment Variables

Add the following to your `.env.local` file:

```env
SARVAM_API_KEY=your_sarvam_api_key_here
PUBLIC_ACCESS=true
DEMO_MODE=false
ENABLE_FALLBACK=true
```

## 3. Usage

All chat requests are handled server-side via the Sarvam AI API. The frontend sends user messages to `/api/sarvam` (already set up in your codebase), which securely calls Sarvam AI and returns the response.

## 4. Security

- API key is never exposed to the client.
- All requests are proxied through your Next.js API route.
- Never commit `.env.local` to version control.

## 5. Troubleshooting

- Ensure your Sarvam AI API key is correct and active.
- Check your deployment platform's environment variable settings.
- Use the `/api/health` endpoint to verify configuration.

## 6. Support

- For Sarvam AI API issues, refer to the Sarvam AI documentation or support.
- For app integration issues, check the README and deployment guides.
