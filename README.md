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
   ```env
   SARVAM_API_KEY=your_sarvam_api_key_here
   PUBLIC_ACCESS=true
   DEMO_MODE=false
   ENABLE_FALLBACK=true
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser** and visit `http://localhost:3000`

## 🌐 Deployment

### Production Deployment

For detailed deployment instructions, see [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md).

**Quick Deploy to Vercel**:
1. Push your code to GitHub
2. Import your repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## 🛠️ Configuration

### Environment Variables

| Variable           | Required | Default | Description                        |
|--------------------|----------|---------|------------------------------------|
| `SARVAM_API_KEY`   | Yes      | -       | Your Sarvam AI API key             |
| `PUBLIC_ACCESS`    | No       | true    | Allow public access to API         |
| `DEMO_MODE`        | No       | false   | Enable demo mode                   |
| `ENABLE_FALLBACK`  | No       | true    | Enable fallback responses          |

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
