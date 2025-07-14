# Vidyos - Sarvam AI Chatbot Application

A modern, production-ready AI chatbot application built with Next.js and Sarvam AI integration.

![Vidyos Chatbot](https://img.shields.io/badge/Status-Production%20Ready-black)
![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-black)
![SarvamAI](https://img.shields.io/badge/Sarvam-AI-black)

## ✨ Features

- 🤖 **AI-Powered Conversations**: Integration with Sarvam AI for intelligent responses
- 💬 **Real-time Chat**: Instant messaging with typing indicators
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🔄 **Persistent Chat History**: Conversations saved in localStorage
- 🛡️ **Production Ready**: Error handling, fallback responses, and health checks
- 🎨 **Minimal UI**: Clean, professional interface with only black, white, and their shades
- 🚀 **Demo Mode**: Test the application without API configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm package manager
- Sarvam AI API key (get it from your Sarvam AI dashboard)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd vidyos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.template .env.local
   ```

4. **Configure your API key** in `.env.local`:
   ```env
   SARVAM_API_KEY=your_sarvam_api_key_here
   DEMO_MODE=false
   ENABLE_FALLBACK=true
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser** and visit `http://localhost:3000`

## 🌐 Deployment

### Production Deployment

For detailed deployment instructions, see [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md).

**Quick Deploy to Vercel**:
1. Push your code to GitHub
2. Import your repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes* | - | Your Google Gemini API key |
| `GEMINI_MODEL` | No | `gemini-1.5-flash` | Gemini model to use |
| `DEMO_MODE` | No | `false` | Enable demo mode |
| `ENABLE_FALLBACK` | No | `true` | Enable fallback responses |
| `PUBLIC_ACCESS` | No | `true` | Allow public access |

*Required for production. Demo mode works without it.

### Application Modes

- **Production Mode**: Full AI functionality with Gemini API
- **Demo Mode**: Mock responses for testing and development
- **Fallback Mode**: Graceful degradation when API is unavailable

### Available Models

- **gemini-1.5-flash**: Fast responses, ideal for most conversations
- **gemini-1.5-pro**: Advanced model for complex tasks
- **gemini-pro**: Standard model for general use

## 📁 Project Structure

```
vidyos/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── gemini/       # Gemini AI integration
│   │   └── health/       # Health check endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main chat interface
├── components/           # React components
│   ├── ui/              # UI components (shadcn/ui)
│   └── chat-bot.tsx     # Chat components
├── lib/                 # Utility functions
├── public/              # Static assets
└── styles/              # Additional styles
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run verify-env  # Verify environment configuration
```

### API Endpoints

- `GET /api/health` - Health check and system status
- `GET /api/gemini/config` - API configuration status
- `POST /api/gemini` - Send chat messages to Gemini AI

### Adding New Features

1. **Frontend Components**: Add to `components/` directory
2. **API Routes**: Add to `app/api/` directory
3. **Styling**: Use Tailwind CSS classes
4. **Types**: Add TypeScript interfaces as needed

## 🔍 Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is not set"**
   - Check your `.env.local` file
   - Verify the API key is correct from Google AI Studio
   - Ensure the file is in the project root

2. **API Connection Issues**
   - Verify internet connection
   - Check Google AI Studio API status
   - Enable fallback mode

3. **Demo Mode**
   - Set `DEMO_MODE=true` for testing
   - Configure `GEMINI_API_KEY` for production

4. **Model Issues**
   - Ensure the model name is correct (gemini-1.5-flash, gemini-1.5-pro, etc.)
   - Check if the model is available in your region

### Health Check

Visit `/api/health` to check system status:
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

## 📊 Performance

- **Lightweight**: Minimal dependencies
- **Fast**: Next.js optimizations
- **Responsive**: Mobile-first design
- **Scalable**: Server-side API architecture

## 🛡️ Security

- Environment variable configuration
- API key protection
- Input validation
- Error handling

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- Check the troubleshooting section
- Review the deployment guide
- Open an issue for bugs or feature requests

## 🔗 Links

- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get your Gemini API key
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ by the Vidyos Team**
