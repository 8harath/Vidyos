# 🚀 Deployment Guide - Vidyos AI Chat

Your application is now ready for deployment with the configured API key: `app-N3KL5egC2gT7HKoYLOHX8RE2`

## 📦 Quick Deploy Options

### 1. **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Steps:
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   ```
   DIFY_API_KEY=app-N3KL5egC2gT7HKoYLOHX8RE2
   DIFY_BASE_URL=https://api.dify.ai/v1
   DIFY_USER_PREFIX=visitor
   DIFY_PUBLIC_ACCESS=true
   ```
4. Deploy automatically

#### CLI Deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DIFY_API_KEY
# Enter: app-N3KL5egC2gT7HKoYLOHX8RE2

vercel env add DIFY_BASE_URL
# Enter: https://api.dify.ai/v1

vercel env add DIFY_USER_PREFIX  
# Enter: visitor

vercel env add DIFY_PUBLIC_ACCESS
# Enter: true
```

### 2. **Netlify**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

#### Steps:
1. Push code to GitHub
2. Connect repo to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Environment variables in Netlify dashboard:
   ```
   DIFY_API_KEY=app-N3KL5egC2gT7HKoYLOHX8RE2
   DIFY_BASE_URL=https://api.dify.ai/v1
   DIFY_USER_PREFIX=visitor
   DIFY_PUBLIC_ACCESS=true
   ```

### 3. **Railway**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

#### Steps:
1. Connect GitHub repo to Railway
2. Select your repository
3. Add environment variables:
   ```
   DIFY_API_KEY=app-N3KL5egC2gT7HKoYLOHX8RE2
   DIFY_BASE_URL=https://api.dify.ai/v1
   DIFY_USER_PREFIX=visitor
   DIFY_PUBLIC_ACCESS=true
   ```
4. Deploy automatically

### 4. **Digital Ocean App Platform**

#### Steps:
1. Create new app from GitHub
2. Configure build settings
3. Add environment variables in DO dashboard
4. Deploy

## 🔧 Pre-Deployment Checklist

### ✅ Environment Variables Set
- [x] `DIFY_API_KEY` = `app-N3KL5egC2gT7HKoYLOHX8RE2`
- [x] `DIFY_BASE_URL` = `https://api.dify.ai/v1`
- [x] `DIFY_USER_PREFIX` = `visitor`
- [x] `DIFY_PUBLIC_ACCESS` = `true`

### ✅ Build Configuration
- [x] Next.js 14 compatible
- [x] All dependencies in package.json
- [x] API routes properly configured
- [x] TypeScript compilation ready

### ✅ Testing
- [x] Local development works
- [x] API connection successful
- [x] Chat functionality operational
- [x] Error handling in place

## 🌐 Custom Domain Setup

After deployment, you can add a custom domain:

### Vercel:
1. Go to project settings
2. Add custom domain
3. Configure DNS records

### Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Update DNS

## 📊 Monitoring & Analytics

### Dify Dashboard
- Monitor API usage: [Dify Dashboard](https://dify.ai/)
- Track conversations and costs
- View response analytics

### Deployment Platform Analytics
- **Vercel**: Built-in analytics and performance monitoring
- **Netlify**: Analytics dashboard
- **Railway**: Resource usage monitoring

## 🔒 Security Notes

### Production Security:
- ✅ API key stored as environment variable
- ✅ Server-side API calls only
- ✅ No client-side key exposure
- ✅ Generic error messages

### Rate Limiting:
Consider implementing rate limiting for production:
```javascript
// Example: Add to API route
const rateLimiter = new Map()

export async function POST(request) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 10
  
  if (!rateLimiter.has(ip)) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs })
  } else {
    const data = rateLimiter.get(ip)
    if (now > data.resetTime) {
      data.count = 1
      data.resetTime = now + windowMs
    } else {
      data.count++
    }
    
    if (data.count > maxRequests) {
      return new Response('Too many requests', { status: 429 })
    }
  }
  
  // Continue with normal API logic...
}
```

## 🚀 Quick Deploy Commands

### Git Setup (if needed):
```bash
git init
git add .
git commit -m "Initial commit - Vidyos AI Chat"
git branch -M main
git remote add origin https://github.com/yourusername/vidyos-ai-chat.git
git push -u origin main
```

### Build Test:
```bash
npm run build
npm start
```

## 📞 Support & Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check all dependencies are installed
   - Verify TypeScript compilation
   - Ensure environment variables are set

2. **API Connection Issues**:
   - Verify API key is correct
   - Check Dify application is active
   - Confirm environment variables in deployment

3. **Runtime Errors**:
   - Check deployment logs
   - Verify all environment variables
   - Test API endpoints directly

### Need Help?
- Check deployment platform documentation
- Review Next.js deployment guides
- Test locally first with production build

## 🎯 Your App is Ready!

Your Vidyos AI Chat application is now configured and ready for deployment with:

- ✅ **Production API Key**: `app-N3KL5egC2gT7HKoYLOHX8RE2`
- ✅ **Server-Side Security**: API key protected
- ✅ **Public Access**: All visitors can use without setup
- ✅ **Multiple Deployment Options**: Vercel, Netlify, Railway, etc.
- ✅ **Modern UI**: Responsive and user-friendly
- ✅ **Real AI**: Powered by your Dify application

Choose your preferred deployment platform and follow the steps above. Your AI chat application will be live and accessible to everyone! 🌟
