#!/bin/bash

# 🚀 SkyBlue Python Launch - Production Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 SkyBlue Python Launch - Production Deployment"
echo "================================================="

# Check if git is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  You have uncommitted changes. Please commit them first."
    git status --short
    exit 1
fi

echo "✅ Git repository is clean"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo "⚠️  You're not on the main branch. Switch to main for production deployment."
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

echo "✅ On main branch"

# Build frontend to check for errors
echo "🔨 Building frontend..."
npm run build

if [[ $? -eq 0 ]]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed. Please fix errors before deploying."
    exit 1
fi

# Check backend dependencies
echo "🔍 Checking backend dependencies..."
cd server
npm install --production --silent
cd ..

echo "✅ Backend dependencies verified"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub"

echo ""
echo "🎯 Next Steps:"
echo "1. 🗄️  Create PostgreSQL database on Render"
echo "2. 🖥️  Deploy backend to Render:"
echo "   - Connect GitHub repo"
echo "   - Root Directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Add environment variables from server/.env.render.template"
echo ""
echo "3. 🌐 Deploy frontend to Vercel:"
echo "   - Run: vercel --prod"
echo "   - Set VITE_API_URL to your Render backend URL"
echo ""
echo "4. 🔧 Update backend FRONTEND_URL with your Vercel URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🚀 Ready for production deployment!"
