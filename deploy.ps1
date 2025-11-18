# Roomify Firebase Deployment Script
# Run this from C:\roomify directory

Write-Host "🚀 Roomify Firebase Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
Write-Host "📦 Checking Firebase CLI..." -ForegroundColor Yellow
$firebaseVersion = firebase --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase CLI not installed!" -ForegroundColor Red
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Firebase CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Firebase CLI ready" -ForegroundColor Green

# Login to Firebase
Write-Host ""
Write-Host "🔐 Checking Firebase authentication..." -ForegroundColor Yellow
firebase projects:list 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Firebase:" -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Firebase login failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Authenticated" -ForegroundColor Green

# Ask user what to deploy
Write-Host ""
Write-Host "What would you like to deploy?" -ForegroundColor Cyan
Write-Host "1. Deploy Security Rules Only (Firestore + Storage)"
Write-Host "2. Build and Deploy Web App"
Write-Host "3. Deploy Everything (Rules + Web App)"
Write-Host "4. Exit"
Write-Host ""
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📋 Deploying Firestore rules..." -ForegroundColor Yellow
        firebase deploy --only firestore:rules
        
        Write-Host ""
        Write-Host "📊 Deploying Firestore indexes..." -ForegroundColor Yellow
        firebase deploy --only firestore:indexes
        
        Write-Host ""
        Write-Host "💾 Deploying Storage rules..." -ForegroundColor Yellow
        firebase deploy --only storage
        
        Write-Host ""
        Write-Host "✅ Security rules deployed!" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "🔨 Building web app..." -ForegroundColor Yellow
        Set-Location roomify-app
        npx expo export:web
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build failed" -ForegroundColor Red
            Set-Location ..
            exit 1
        }
        Set-Location ..
        
        Write-Host ""
        Write-Host "🌐 Deploying to Firebase Hosting..." -ForegroundColor Yellow
        firebase deploy --only hosting
        
        Write-Host ""
        Write-Host "✅ Web app deployed!" -ForegroundColor Green
        Write-Host "🎉 Visit: https://roomify-483a2.web.app" -ForegroundColor Cyan
    }
    "3" {
        Write-Host ""
        Write-Host "🔨 Building web app..." -ForegroundColor Yellow
        Set-Location roomify-app
        npx expo export:web
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build failed" -ForegroundColor Red
            Set-Location ..
            exit 1
        }
        Set-Location ..
        
        Write-Host ""
        Write-Host "🚀 Deploying everything to Firebase..." -ForegroundColor Yellow
        firebase deploy
        
        Write-Host ""
        Write-Host "✅ Everything deployed!" -ForegroundColor Green
        Write-Host "🎉 Visit: https://roomify-483a2.web.app" -ForegroundColor Cyan
    }
    "4" {
        Write-Host "👋 Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✨ Deployment complete!" -ForegroundColor Green
Write-Host ""
