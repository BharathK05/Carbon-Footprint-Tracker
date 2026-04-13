# Vercel Deployment Guide

## Prerequisites

1. A [Vercel](https://vercel.com) account (free tier available)
2. Your project pushed to GitHub/GitLab/Bitbucket
3. Google Gemini API key from [Google AI Studio](https://aistudio.google.com)

## Environment Variables

Before deploying, you need to set up environment variables:

### Local Development

1. Copy `.env.local.example` to `.env.local` (if available):
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

### Production (Vercel Dashboard)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for production (`Production`):
   - `GEMINI_API_KEY`: Your Google Gemini API key

## Deployment Steps

### Option 1: Vercel Dashboard (Easiest)

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Select your GitHub repository
4. Framework preset should auto-detect as **Next.js**
5. Configure environment variables in the dialog
6. Click **Deploy**

### Option 2: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from project root:
   ```bash
   vercel
   ```

3. Follow the prompts to connect your project
4. Add environment variables when prompted

## Verification After Deployment

1. Visit your deployed URL
2. Test the carbon calculator form
3. Verify API calls complete successfully in browser DevTools
4. Check Serverless Functions logs in Vercel Dashboard

## Environment Variables Reference

| Variable | Description | Required | Where to get |
|----------|-------------|----------|--------------|
| `GEMINI_API_KEY` | Google Generative AI API Key | Yes | [Google AI Studio](https://aistudio.google.com) |

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types with `npm run build` locally

### API Returns 500 Errors
- Check Serverless Functions logs in Vercel Dashboard
- Verify `GEMINI_API_KEY` is set in production environment
- Test API locally: `npm run build && npm start`

### Deployment is Slow
- First deployment is normal (establishes infrastructure)
- Subsequent deployments are typically faster
- Check Vercel status at [status.vercel.com](https://status.vercel.com)

## Security Best Practices

1. **Never commit `.env.local`** - Already configured in `.gitignore`
2. **Use different API keys** - Consider having separate keys for dev/prod
3. **Rotate API keys regularly** - Update in Vercel when keys change
4. **Monitor API usage** - Check Google Cloud Console for unusual activity

## Performance Optimization

The project is already optimized for Vercel with:
- Next.js 16.2.3 (latest with App Router)
- Serverless Functions for API routes
- Static generation where possible
- Image optimization via Next.js

## Additional Resources

- [Next.js on Vercel Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Google Generative AI Documentation](https://ai.google.dev/docs)
