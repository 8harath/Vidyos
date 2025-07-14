# Production Deployment Guide for Vidyos Chatbot

This guide will help you deploy your Vidyos chatbot application to production with proper configuration.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root and add your Sarvam AI credentials:

```env
SARVAM_API_KEY=your_actual_sarvam_api_key_here
PUBLIC_ACCESS=true
DEMO_MODE=false
ENABLE_FALLBACK=true
```

### 2. Local Development

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to test your application.

## 🌐 Production Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready chatbot"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `SARVAM_API_KEY`: Your Sarvam AI API key
     - `PUBLIC_ACCESS`: `true`
     - `DEMO_MODE`: `false`
     - `ENABLE_FALLBACK`: `true`

3. **Deploy**:
   - Click "Deploy" in Vercel
   - Your app will be live at `https://your-app.vercel.app`

### Other Platforms (Netlify, Railway, etc.)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform:
   - `SARVAM_API_KEY`: Your Sarvam AI API key
   - `PUBLIC_ACCESS`: `true`
   - `DEMO_MODE`: `false`
   - `ENABLE_FALLBACK`: `true`

3. **Deploy** the built application

## 🔧 Configuration Options

| Variable           | Required | Default | Description                        |
|--------------------|----------|---------|------------------------------------|
| `SARVAM_API_KEY`   | Yes      | -       | Your Sarvam AI API key             |
| `PUBLIC_ACCESS`    | No       | true    | Allow public access to API         |
| `DEMO_MODE`        | No       | false   | Enable demo mode                   |
| `ENABLE_FALLBACK`  | No       | true    | Enable fallback responses          |

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Keep your Sarvam AI API key secure and rotate it regularly
3. **Public Access**: Consider implementing user authentication for production use
4. **Rate Limiting**: Implement rate limiting for production deployments

## 🔍 Troubleshooting

### Common Issues

1. **"SARVAM_API_KEY environment variable is not set"**
   - Make sure you've set the `SARVAM_API_KEY` in your environment variables
   - For local development, check your `.env.local` file
   - For production, check your hosting platform's environment variables

2. **API Connection Issues**
   - Verify your Sarvam AI API key is correct
   - Check if the Sarvam AI service is accessible
   - Enable fallback mode by setting `ENABLE_FALLBACK=true`

3. **Demo Mode**
   - If you see demo responses, check that `DEMO_MODE=false` and `SARVAM_API_KEY` is set
   - Demo mode is useful for development and testing

### Health Check

Your application includes a health check endpoint: `/api/health`

This will return:
```json
{
  "status": "healthy",
  "config": {
    "apiKeyConfigured": true,
    "demoMode": false,
    "fallbackEnabled": true
  }
}
```

## 📊 Monitoring & Analytics

- Monitor API usage in your Sarvam AI dashboard
- Use your deployment platform's analytics for performance and error tracking

## 🛡️ Security Notes

- API key stored as environment variable
- Server-side API calls only
- No client-side key exposure
- Generic error messages

## 🎉 Your Sarvam AI chatbot is now ready for production!
