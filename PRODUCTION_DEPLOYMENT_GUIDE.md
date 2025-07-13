# Production Deployment Guide for Vidyos Chatbot

This guide will help you deploy your Vidyos chatbot application to production with proper configuration.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment template and configure your settings:

```bash
cp .env.template .env.local
```

Edit `.env.local` with your actual values:

```env
# Required: Get your API key from https://dify.ai/
DIFY_API_KEY=your_actual_dify_api_key_here

# Optional: Customize these if needed
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_USER_PREFIX=visitor
DIFY_PUBLIC_ACCESS=true

# Production settings
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
     - `DIFY_API_KEY`: Your Dify API key
     - `DIFY_BASE_URL`: `https://api.dify.ai/v1`
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
   - `DIFY_API_KEY`: Your Dify API key
   - `DIFY_BASE_URL`: `https://api.dify.ai/v1`
   - `DEMO_MODE`: `false`
   - `ENABLE_FALLBACK`: `true`

3. **Deploy** the built application

## 🔧 Configuration Options

### API Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DIFY_API_KEY` | Yes* | - | Your Dify API key from dify.ai |
| `DIFY_BASE_URL` | No | `https://api.dify.ai/v1` | Dify API endpoint |
| `DIFY_USER_PREFIX` | No | `visitor` | Prefix for anonymous users |
| `DIFY_PUBLIC_ACCESS` | No | `true` | Allow public access |

*Required for production use. Demo mode works without it.

### Application Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEMO_MODE` | No | `false` | Enable demo responses |
| `ENABLE_FALLBACK` | No | `true` | Enable fallback responses when API fails |

## 🔍 Troubleshooting

### Common Issues

1. **"DIFY_API_KEY environment variable is not set"**
   - Make sure you've set the `DIFY_API_KEY` in your environment variables
   - For local development, check your `.env.local` file
   - For production, check your hosting platform's environment variables

2. **API Connection Issues**
   - Verify your Dify API key is correct
   - Check if the Dify service is accessible
   - Enable fallback mode by setting `ENABLE_FALLBACK=true`

3. **Demo Mode**
   - If you see demo responses, check that `DEMO_MODE=false` and `DIFY_API_KEY` is set
   - Demo mode is useful for development and testing

### Health Check

Your application includes a health check endpoint: `/api/dify/config`

This will return:
```json
{
  "configured": true,
  "baseUrl": "https://api.dify.ai/v1",
  "demoMode": false,
  "fallbackEnabled": true,
  "apiKeySet": true
}
```

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Keep your Dify API key secure and rotate it regularly
3. **Public Access**: Consider implementing user authentication for production use
4. **Rate Limiting**: Implement rate limiting for production deployments

## 📊 Features

✅ **Production Ready Features**:
- Environment-based configuration
- Demo mode for development
- Fallback responses for reliability
- Error handling and user feedback
- Persistent chat history (localStorage)
- Clean, professional UI
- Mobile responsive design

✅ **Deployment Ready**:
- Next.js optimized build
- Server-side API routes
- Environment variable configuration
- Health check endpoints

## 📞 Support

If you encounter issues:

1. Check the application logs
2. Verify environment variable configuration
3. Test the health check endpoint
4. Review the troubleshooting section above

For Dify-specific issues, visit [Dify Documentation](https://docs.dify.ai/)
