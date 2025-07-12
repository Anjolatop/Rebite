# 🌍 Rebite: Smart Food Rescue Platform

**Rescue food. Respect values. Reinvent access.**

Rebite connects consumers with surplus, imperfect, and near-expiry food from local farmers and restaurants using AI-powered personalization, value-based behavior tracking, and gamified user experiences — all aligned with UN SDG 2 (Zero Hunger) and 12 (Responsible Consumption and Production).

## 🚀 Features

### 🏪 Vendor Listing Portals
- **Farmer Dashboard**: List surplus/imperfect produce with real images, expiration dates, nutritional info
- **Restaurant Dashboard**: List unsold meals or near-expiry ingredients with inventory tracking

### 🧠 AI-Personalized Food Feed
- Smart feed tailored to dietary needs, user goals, and nutrition alignment
- "Rescue Score" and goal-tagged badges
- Value-based recommendations

### 🔍 Search & Filters
- Search by ingredient, category, vendor type, price, expiry, nutritional content
- Smart filters for value-aligned food and affordable & healthy combinations

### 📊 Value-Based Goal Tracking System
- Users select 5+ goals (e.g., Lose 50 lbs, Eat more greens, Spend less)
- Each goal maps to core values: Discipline, Mindfulness, Prudence, Empathy
- Progress bars with level-up mechanics

### 🎮 Gamification & Rewards System
- Points earning through purchases, value alignment, streaks, referrals
- Badges, streaks, weekly challenges
- Points can be redeemed, gifted, or donated

### 🍳 Smart Recipes at Checkout
- "Cook With What You've Got" feature
- Recipe suggestions using cart ingredients
- Missing ingredients with 1-tap upsell

### 🤝 Inclusive Access via USSD
- Text-based menu for users without smartphones
- Browse listings, view goals, place orders, gift/donate points

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Next.js 14** for SSR and routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Zustand** for state management

### Backend
- **Node.js** with TypeScript
- **Express.js** for API
- **PostgreSQL** with PostGIS for database
- **Redis** for caching and sessions
- **JWT** for authentication
- **Stripe** for payments
- **AWS S3** for file storage

### AI & ML
- **Python FastAPI** for recommendation engine
- **TensorFlow** for nutrition scoring
- **OpenAI API** for recipe suggestions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Python 3.9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rebite
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Dashboard: http://localhost:3000/admin

## 📱 User Flows

### Consumer Onboarding
1. Welcome screen with mission statement
2. Goal selection carousel (weight loss, muscle gain, diabetic-friendly, etc.)
3. Allergy and diet preference setup
4. Optional fitness tracker sync
5. Value selection and mapping

### Vendor Onboarding
1. Vendor type selection (Farmer/Restaurant)
2. Business verification
3. Location setup with PostGIS
4. Inventory management training

### Food Discovery
1. AI-powered personalized feed
2. Search and filter options
3. Rescue score and value badges
4. Nutritional information display

### Checkout & Delivery
1. Cart management with recipe suggestions
2. Payment processing (card, EBT, points)
3. Local delivery coordination
4. Order tracking and notifications

## 🎯 Core Values & Gamification

### Value Bars
- **Discipline**: Healthy choices, portion control
- **Mindfulness**: Local, seasonal, sustainable choices
- **Prudence**: Budget-friendly, waste-reducing choices
- **Empathy**: Community-focused, sharing choices

### Points System
- Base rescue points: +10 per rescued item
- Value alignment: +5-15 points
- Level up rewards: +50 points
- Streak bonuses: +20 points
- Referral rewards: +100 points

## 🌟 Revenue Model

- **Transaction Fee**: 10% per rescued food order
- **Premium Subscriptions**: Early access, recipe kits, insights
- **Strategic Partnerships**: Clinics, schools, food NGOs
- **Reward Sponsorships**: Sustainable brands in points store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Impact

Rebite is designed to:
- Reduce food waste and fight hunger
- Support local farmers and restaurants
- Promote healthy, sustainable eating habits
- Build community through gamified engagement
- Provide inclusive access to affordable nutrition

---

**Rebite** — Making food rescue smart, sustainable, and accessible for everyone. 