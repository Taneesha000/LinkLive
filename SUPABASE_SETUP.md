# Supabase Setup Instructions

## Quick Setup (Optional)

To enable real authentication instead of demo mode:

1. **Create a Supabase project:**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/login and create a new project
   - Wait for the project to be ready

2. **Get your credentials:**
   - Go to Settings > API in your Supabase dashboard
   - Copy the "Project URL" and "anon public" key

3. **Create environment file:**
   - Create a file named `.env.local` in the project root
   - Add these lines (replace with your actual values):
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Demo Mode (Current)

Without Supabase setup, the app runs in demo mode:
- Login/Signup forms work but don't actually authenticate
- You'll see "Demo mode - Auth not configured" messages
- All other features work normally

## Features Available

- ✅ **Visualizations**: Network Graph, Communication Flow, Interaction Patterns, Real-time Feed
- ✅ **Analytics**: Social Metrics, Engagement Trends, Sentiment Analysis  
- ✅ **Account**: Login, Signup, Forgot Password, Contact Support, Team Builder
- ✅ **All components work** regardless of auth configuration
