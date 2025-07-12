# Rebite - AI-Powered Food Rescue Platform

Rebite is a comprehensive AI-powered food rescue platform that connects farmers and restaurants with consumers to reduce food waste, support local businesses, and build a sustainable food ecosystem.

## 🌟 Features

### Core Platform
- **Food Rescue Marketplace**: Connect consumers with local farmers and restaurants offering surplus food at discounted prices
- **AI-Powered Recommendations**: Smart suggestions based on dietary preferences, location, and past behavior
- **Gamification System**: Points, achievements, and value bars to encourage sustainable behavior
- **USSD Support**: Low-tech access for users without smartphones
- **Real-time Tracking**: Monitor orders from purchase to delivery

### User Experience
- **Personalized Feed**: Curated listings based on user preferences and location
- **Advanced Search & Filters**: Find food by category, price, distance, dietary restrictions
- **Recipe Suggestions**: AI-generated recipes using purchased ingredients
- **Value Bars**: Track impact on sustainability, health, community, and environmental goals
- **Points System**: Earn points for purchases, reviews, and sustainable actions

### Vendor Features
- **Vendor Dashboard**: Manage listings, track sales, and view analytics
- **Inventory Management**: Easy listing creation with expiration dates and pricing
- **Analytics**: Detailed insights on sales, customer behavior, and impact metrics
- **Order Management**: Real-time order updates and delivery coordination

### Technical Features
- **Real-time Updates**: WebSocket integration for live order tracking
- **Payment Integration**: Secure Stripe payment processing
- **SMS Notifications**: Twilio integration for order updates
- **File Upload**: AWS S3 integration for images and documents
- **Spatial Search**: PostgreSQL with PostGIS for location-based queries

## 🏗️ Architecture

### Backend (Node.js/Express)
- **RESTful API**: Comprehensive endpoints for all platform features
- **PostgreSQL**: Primary database with PostGIS for spatial data
- **Redis**: Caching and session management
- **JWT Authentication**: Secure user authentication and authorization
- **Rate Limiting**: API protection and abuse prevention
- **File Upload**: AWS S3 integration for media storage

### Frontend (React)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **State Management**: React Query for server state, Zustand for client state
- **Animations**: Smooth transitions with Framer Motion
- **Real-time Updates**: WebSocket integration for live data
- **Progressive Web App**: Offline capabilities and mobile optimization

### Key Technologies
- **Backend**: Node.js, Express, PostgreSQL, Redis, JWT
- **Frontend**: React, React Query, Zustand, Tailwind CSS, Framer Motion
- **External APIs**: Stripe (payments), Twilio (SMS), AWS S3 (storage)
- **Infrastructure**: Docker, Nginx, PM2

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+ with PostGIS extension
- Redis 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rebite.git
   cd rebite
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb rebite
   
   # Run database migrations
   psql -d rebite -f server/config/schema.sql
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
rebite/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── index.js      # App entry point
│   └── public/           # Static assets
├── server/               # Node.js backend
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   ├── config/          # Database and config files
│   └── index.js         # Server entry point
├── package.json         # Root package.json
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/rebite
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rebite
DB_USER=username
DB_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=rebite-uploads

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# External APIs
SPOONACULAR_API_KEY=your-spoonacular-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Database Setup

1. Install PostgreSQL and PostGIS
2. Create a database named `rebite`
3. Run the schema file: `psql -d rebite -f server/config/schema.sql`

## 🎯 Key Features Explained

### Value Bars System
The platform tracks four key value bars:
- **Sustainability**: Environmental impact of food choices
- **Health**: Nutritional value and dietary preferences
- **Community**: Support for local businesses and farmers
- **Impact**: Overall contribution to food waste reduction

### Gamification
- **Points**: Earn points for purchases, reviews, and sustainable actions
- **Achievements**: Unlock badges for milestones and special actions
- **Leaderboards**: Compete with other users on various metrics
- **Challenges**: Participate in time-limited challenges for bonus rewards

### AI Recommendations
- **Personalized Feed**: Curated listings based on user preferences
- **Recipe Suggestions**: AI-generated recipes using purchased ingredients
- **Smart Matching**: Connect users with vendors based on location and preferences
- **Predictive Analytics**: Forecast demand and optimize inventory

## 🧪 Testing

```bash
# Run backend tests
npm run test:server

# Run frontend tests
npm run test:client

# Run all tests
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need to reduce food waste globally
- Designed to support local food ecosystems
- Created with sustainability and community in mind

## 📞 Support

For support, email support@rebite.com or join our Slack channel.

---

**Rebite** - Rescue Food. Respect Values. Reinvent Access.