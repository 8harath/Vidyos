# 🚀 Public Dify API Setup Guide

## Overview
Your Vidyos chat application is now configured to use a **shared Dify API key** that all visitors can use without needing their own credentials. This is perfect for public demonstrations, educational purposes, or when you want to provide AI chat capabilities to all users.

## ⚙️ Server Configuration

### 1. Environment Variables Setup

Edit the `.env.local` file in your project root:

```env
# Replace 'your_api_key_here' with your actual Dify API key
DIFY_API_KEY=your_actual_api_key_from_dify

# Base URL (usually default)
DIFY_BASE_URL=https://api.dify.ai/v1

# User prefix for visitor identification
DIFY_USER_PREFIX=visitor

# Enable public access (set to false to disable)
DIFY_PUBLIC_ACCESS=true
```

### 2. Get Your Dify API Key

1. Go to [Dify.ai](https://dify.ai/) and log in
2. Create or select a **Conversational Application**
3. Navigate to **Applications** → **Access API**
4. Click **Create API Key** and copy it
5. Replace `your_api_key_here` in `.env.local` with your actual key

### 3. Restart the Server

After setting up your `.env.local` file:

```bash
npm run dev
```

The server will automatically load your environment variables.

## 🌟 How It Works

### For Visitors:
- **No Setup Required**: Visitors can immediately start chatting
- **Automatic User IDs**: Each visitor gets a unique identifier
- **Conversation History**: Maintained during their session
- **No API Key Needed**: Everything handled server-side

### For You (Administrator):
- **Single API Key**: Your key is used for all visitors
- **Cost Control**: All API usage goes through your Dify account
- **Security**: API key is never exposed to visitors
- **Monitoring**: Track usage in your Dify dashboard

## 🛡️ Security Features

### 1. Server-Side API Calls
- API key stored securely on server
- Never exposed to client browsers
- Protected from inspection/theft

### 2. Error Handling
- Generic error messages to visitors
- Detailed logging on server console
- Graceful fallbacks when API is unavailable

### 3. User Identification
- Unique visitor IDs generated automatically
- Format: `visitor-timestamp-randomid`
- No personal data required from users

## 📊 Usage Monitoring

### Check API Status
- Click the ⚙️ button in the header to check API status
- Green "API Ready" = Everything working
- Red "API Not Ready" = Configuration needed

### Dify Dashboard
- Monitor usage in your Dify application dashboard
- Track conversations and API calls
- Manage costs and limits

## 🔧 Configuration Options

### Disable Public Access
Set in `.env.local`:
```env
DIFY_PUBLIC_ACCESS=false
```

### Change User Prefix
Customize how visitor IDs are generated:
```env
DIFY_USER_PREFIX=demo
# Results in: demo-timestamp-randomid
```

### Custom Base URL
For self-hosted Dify instances:
```env
DIFY_BASE_URL=https://your-dify-instance.com/v1
```

## 🚨 Important Considerations

### 1. Cost Management
- **Monitor Usage**: All API calls use your credits
- **Set Limits**: Configure rate limits in Dify if needed
- **Track Costs**: Watch your Dify billing dashboard

### 2. Content Moderation
- **User Input**: Consider implementing content filters
- **AI Responses**: Monitor for inappropriate content
- **Usage Policies**: Consider adding terms of use

### 3. Performance
- **Rate Limiting**: Dify may have rate limits
- **Scaling**: Consider costs with high traffic
- **Caching**: Implement caching for common queries if needed

## 🔄 Migration from Individual API Keys

If you previously had individual user configuration:

1. Users no longer need to configure API keys
2. Existing chat history remains intact
3. New conversations use the shared API
4. Configuration UI is replaced with status checking

## 📝 Troubleshooting

### API Not Ready Status
1. Check `.env.local` file exists and has correct API key
2. Restart the development server
3. Verify API key is valid in Dify dashboard
4. Check server console for error messages

### No Responses from AI
1. Verify your Dify application is properly configured
2. Check if your API key has sufficient credits
3. Ensure your Dify app is published and active
4. Check server logs for detailed error messages

### Server Errors
1. Check `.env.local` file format
2. Ensure DIFY_API_KEY is set correctly
3. Restart the server after changes
4. Check console for detailed error logs

## 🎯 Best Practices

### 1. Application Configuration
- Configure clear prompts in your Dify app
- Add knowledge bases for specialized topics
- Set appropriate response lengths
- Test thoroughly before public deployment

### 2. Monitoring
- Regularly check usage in Dify dashboard
- Monitor for unusual usage patterns
- Set up alerts for high usage if available

### 3. User Experience
- Provide clear instructions for users
- Handle errors gracefully
- Consider adding usage guidelines

## 📞 Support

### If You Need Help:
1. Check the Dify documentation
2. Verify your environment variables
3. Check server console logs
4. Test your API key directly in Dify dashboard

Your application is now ready for public use with your shared Dify API! 🎉

## 🔗 Quick Links
- [Dify Documentation](https://docs.dify.ai/)
- [Dify Dashboard](https://dify.ai/)
- [API Reference](https://docs.dify.ai/guides/application-orchestrate/creating-an-application)
