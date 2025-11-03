# Setting Up Your Bunny Game on GitHub Pages

Follow these steps to get your game online with a real URL:

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "bunny-hop-game")
4. Make it public
5. Click "Create repository"

## Step 2: Upload Your Game Files

### Option A: Using GitHub Website (Easiest)
1. In your new repository, click "uploading an existing file"
2. Drag and drop all files from this folder:
   - index.html
   - style.css
   - game.js
   - README.md
3. Click "Commit changes"

### Option B: Using Git Command Line
```bash
# Navigate to your game directory
cd /Users/leeannetan/Documents/trae_projects/newproject

# Initialize git repository
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit of Bunny Hop game"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait a few minutes for deployment

## Step 4: Access Your Game Online

Your game will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

That's it! You now have a real website for your Bunny Hop Adventure game that you can share with anyone!