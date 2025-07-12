# 🚀 Rebite Quick Start Guide

Get Rebite up and running in minutes!

## Prerequisites

- **Docker** (with Docker Compose)
- **Node.js** 18+ 
- **npm** or **yarn**

## Quick Setup (Recommended)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd rebite

# Make setup script executable
chmod +x setup.sh

# Run the automated setup
./setup.sh
```

This will:
- ✅ Check prerequisites
- ✅ Install all dependencies
- ✅ Set up environment variables
- ✅ Start Docker services (PostgreSQL, Redis)
- ✅ Run database migrations
- ✅ Build and start all services

### 2. Access the Application

Once setup is complete, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/health
- **pgAdmin**: http://localhost:5050 (admin@rebite.com / admin)
- **MailHog**: http://localhost:8025 (for email testing)

## Manual Setup

If you prefer manual setup:

### 1. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

### 2. Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start Services
```bash
# Start database and cache
docker-compose up -d postgres redis

# Wait for services to be ready
sleep 10

# Run database migrations
cd backend
npm run db:migrate
npm run db:seed
cd ..

# Start all services
docker-compose up -d
```

## Development Commands

### Start Development Environment
```bash
./setup.sh dev
```

### View Logs
```bash
./setup.sh logs
```

### Stop Services
```bash
./setup.sh stop
```

### Restart Services
```bash
./setup.sh restart
```

### Clean Up
```bash
./setup.sh clean
```

## First Steps

### 1. Create Your Account
1. Visit http://localhost:3000
2. Click "Get Started Free"
3. Fill in your details and create an account
4. Check your email (or MailHog at http://localhost:8025) for verification

### 2. Complete Your Profile
1. Set your nutrition goals
2. Add dietary preferences and allergies
3. Choose your sustainability values
4. Set your location

### 3. Explore Features
- **Browse Listings**: See rescued food from local vendors
- **Value Tracking**: Watch your value bars grow
- **Points System**: Earn and spend points
- **Recipe Suggestions**: Get cooking ideas for your purchases

## API Testing

### Using curl
```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman
1. Import the API collection from `docs/postman_collection.json`
2. Set the base URL to `http://localhost:8000/api`
3. Start testing endpoints

## Database Management

### Access pgAdmin
1. Visit http://localhost:5050
2. Login with admin@rebite.com / admin
3. Add server:
   - Host: postgres
   - Port: 5432
   - Username: postgres
   - Password: password

### Direct Database Access
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d rebite

# View tables
\dt

# Sample queries
SELECT * FROM users LIMIT 5;
SELECT * FROM listings WHERE is_active = true;
```

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process or change ports in docker-compose.yml
```

**Database connection failed**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

**Frontend not loading**
```bash
# Check if frontend is building
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

**Email not working**
- Check MailHog at http://localhost:8025
- Verify SMTP settings in `.env`
- Check backend logs: `docker-compose logs backend`

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v
docker system prune -f

# Start fresh
./setup.sh
```

## Development Tips

### Hot Reload
- Frontend changes are automatically reflected
- Backend changes require restart: `docker-compose restart backend`

### Environment Variables
- Edit `.env` file for configuration changes
- Restart services after changing environment variables

### Database Changes
```bash
# Create new migration
cd backend
npm run db:migrate:make -- create_new_table

# Run migrations
npm run db:migrate

# Rollback if needed
npm run db:rollback
```

### Adding New Features
1. Create new routes in `backend/src/routes/`
2. Add controllers in `backend/src/controllers/`
3. Create database migrations
4. Add frontend components in `frontend/src/components/`
5. Update API documentation

## Production Deployment

### Environment Variables
Update `.env` with production values:
- Strong JWT secrets
- Production database credentials
- AWS S3 configuration
- Stripe production keys
- Email service configuration

### Build for Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### SSL/HTTPS
- Configure Nginx with SSL certificates
- Update frontend URLs to use HTTPS
- Set up domain and DNS

## Support

- **Documentation**: Check `README.md` and `API_DOCUMENTATION.md`
- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub Discussions for questions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Happy coding! 🌍**

Remember: Rebite is about making food rescue smart, sustainable, and accessible for everyone. 