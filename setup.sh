#!/bin/bash

# Rebite Platform Setup Script
echo "🚀 Setting up Rebite - AI-Powered Food Rescue Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 13+ with PostGIS extension."
    echo "   You can continue with the setup, but you'll need to install PostgreSQL later."
fi

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "⚠️  Redis is not installed. Please install Redis 6+."
    echo "   You can continue with the setup, but you'll need to install Redis later."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p server/uploads

# Database setup instructions
echo ""
echo "🗄️  Database Setup Instructions:"
echo "1. Install PostgreSQL 13+ with PostGIS extension"
echo "2. Create a database named 'rebite':"
echo "   createdb rebite"
echo "3. Run the schema file:"
echo "   psql -d rebite -f server/config/schema.sql"
echo ""

# Redis setup instructions
echo "🔴 Redis Setup Instructions:"
echo "1. Install Redis 6+"
echo "2. Start Redis server:"
echo "   redis-server"
echo ""

# Environment setup instructions
echo "⚙️  Environment Setup:"
echo "1. Edit the .env file with your configuration"
echo "2. Set up external services (Stripe, Twilio, AWS S3)"
echo "3. Configure API keys for external services"
echo ""

# Start instructions
echo "🚀 To start the development servers:"
echo "   npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""

echo "🎉 Setup complete! Follow the instructions above to configure your environment."
echo ""
echo "📚 For more information, see the README.md file."