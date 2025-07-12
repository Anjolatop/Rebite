#!/bin/bash

# Rebite Setup Script
# This script sets up the complete Rebite development environment

set -e

echo "🌍 Welcome to Rebite Setup!"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi
    
    print_success "All dependencies installed"
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "Environment file created from example"
        else
            print_warning "No env.example found. Please create .env file manually."
        fi
    else
        print_success "Environment file already exists"
    fi
}

# Start Docker services
start_docker_services() {
    print_status "Starting Docker services..."
    
    # Start PostgreSQL and Redis
    docker-compose up -d postgres redis
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Docker services started successfully"
    else
        print_error "Failed to start Docker services"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    until docker-compose exec -T postgres pg_isready -U postgres; do
        sleep 2
    done
    
    # Run database migrations
    print_status "Running database migrations..."
    cd backend
    npm run db:migrate
    
    # Run database seeds
    print_status "Running database seeds..."
    npm run db:seed
    cd ..
    
    print_success "Database setup completed"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    docker-compose build backend frontend
    
    print_success "Docker images built successfully"
}

# Start development environment
start_dev_environment() {
    print_status "Starting development environment..."
    
    # Start all services
    docker-compose up -d
    
    print_success "Development environment started!"
    echo ""
    echo "🌍 Rebite is now running!"
    echo "================================"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8000"
    echo "API Health: http://localhost:8000/health"
    echo "pgAdmin: http://localhost:5050 (admin@rebite.com / admin)"
    echo "MailHog: http://localhost:8025"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
    echo "To restart: docker-compose restart"
}

# Main setup function
main() {
    echo "Starting Rebite setup..."
    echo ""
    
    # Check prerequisites
    check_docker
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Setup environment
    setup_env
    
    # Start Docker services
    start_docker_services
    
    # Setup database
    setup_database
    
    # Build images
    build_images
    
    # Start development environment
    start_dev_environment
    
    echo ""
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Visit http://localhost:3000 to see the application"
    echo "2. Create your first account at http://localhost:3000/auth/register"
    echo "3. Check the README.md for more information"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    "dev")
        print_status "Starting development environment..."
        docker-compose up -d
        ;;
    "stop")
        print_status "Stopping all services..."
        docker-compose down
        ;;
    "restart")
        print_status "Restarting all services..."
        docker-compose restart
        ;;
    "logs")
        print_status "Showing logs..."
        docker-compose logs -f
        ;;
    "clean")
        print_status "Cleaning up..."
        docker-compose down -v
        docker system prune -f
        ;;
    "help")
        echo "Rebite Setup Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  - Full setup (install, build, start)"
        echo "  dev        - Start development environment"
        echo "  stop       - Stop all services"
        echo "  restart    - Restart all services"
        echo "  logs       - Show logs"
        echo "  clean      - Clean up containers and volumes"
        echo "  help       - Show this help"
        ;;
    *)
        main
        ;;
esac 