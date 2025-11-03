#!/bin/bash

# Simple deployment script for Bunny Hop Adventure game
# This script helps you quickly deploy your game to GitHub Pages

echo "🐰 Bunny Hop Adventure - Deployment Helper 🐰"
echo "============================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Prompt for repository information
read -p "Enter your GitHub username: " username
read -p "Enter your repository name (e.g., bunny-hop-game): " repo_name

# Add all files to git
echo "📂 Adding game files to repository..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy Bunny Hop Adventure game"

# Add remote repository if not already added
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding remote repository..."
    git remote add origin "https://github.com/$username/$repo_name.git"
else
    echo "🔄 Remote repository already exists, updating..."
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo ""
echo "✅ Deployment process completed!"
echo ""
echo "🌐 Your game will be available at: https://$username.github.io/$repo_name/"
echo "   (It might take a few minutes for GitHub Pages to deploy)"
echo ""
echo "📝 Don't forget to enable GitHub Pages in your repository settings:"
echo "   1. Go to https://github.com/$username/$repo_name/settings"
echo "   2. Scroll down to 'GitHub Pages' section"
echo "   3. Select 'main' branch as source"
echo "   4. Click 'Save'"
echo ""
echo "🎮 Enjoy your online Bunny Hop Adventure game! 🐰"