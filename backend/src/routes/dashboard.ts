import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get user dashboard data
router.get('/user', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // In a real app, this would fetch from database
    const user = {
      id: req.user?.id,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer', // 'buyer', 'farmer', 'restaurant'
      avatar: '/api/placeholder/40/40',
      nutritionProfile: {
        dietaryGoals: ['weight-loss', 'heart-health'],
        allergies: ['nuts', 'gluten'],
        preferences: ['high-protein', 'low-carb'],
        fitnessTracker: 'fitbit'
      },
      stats: {
        ordersPlaced: 12,
        moneySaved: 156.50,
        foodRescued: 23.4, // kg
        carbonFootprint: 45.2 // kg CO2 saved
      }
    };

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
});

// Update nutrition profile
router.post('/nutrition-profile', authenticateToken, [
  body('dietaryGoals').isArray().optional(),
  body('allergies').isArray().optional(),
  body('preferences').isArray().optional(),
  body('fitnessTracker').isString().optional(),
  body('age').isNumeric().optional(),
  body('weight').isNumeric().optional(),
  body('height').isNumeric().optional(),
  body('activityLevel').isString().optional()
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      dietaryGoals,
      allergies,
      preferences,
      fitnessTracker,
      age,
      weight,
      height,
      activityLevel
    } = req.body;

    // In a real app, this would save to database
    const nutritionProfile = {
      dietaryGoals: dietaryGoals || [],
      allergies: allergies || [],
      preferences: preferences || [],
      fitnessTracker: fitnessTracker || '',
      age: age || null,
      weight: weight || null,
      height: height || null,
      activityLevel: activityLevel || '',
      updatedAt: new Date()
    };

    return res.json({ 
      success: true, 
      message: 'Nutrition profile updated successfully',
      data: nutritionProfile 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update nutrition profile' });
  }
});

// Get farmer dashboard data
router.get('/farmer', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // In a real app, this would fetch from database
    const farmerData = {
      stats: {
        activeListings: 12,
        ordersToday: 8,
        revenue: 1240.50,
        foodSaved: 156.2 // kg
      },
      recentOrders: [
        {
          id: '1',
          product: 'Fresh Tomatoes',
          customer: 'Sarah M.',
          status: 'completed',
          amount: 12.50,
          date: new Date()
        },
        {
          id: '2',
          product: 'Organic Carrots',
          customer: 'Mike R.',
          status: 'pending',
          amount: 8.75,
          date: new Date()
        }
      ],
      inventory: [
        {
          id: '1',
          title: 'Fresh Organic Tomatoes',
          quantity: '5kg',
          price: 2.50,
          expiryDate: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          title: 'Mixed Organic Greens',
          quantity: '3 bunches',
          price: 3.00,
          expiryDate: '2024-01-16',
          status: 'active'
        }
      ]
    };

    return res.json({ success: true, data: farmerData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch farmer data' });
  }
});

// Get restaurant dashboard data
router.get('/restaurant', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // In a real app, this would fetch from database
    const restaurantData = {
      stats: {
        activeMeals: 15,
        ordersToday: 23,
        revenue: 2450.75,
        foodSaved: 89.3 // kg
      },
      recentOrders: [
        {
          id: '1',
          meal: 'Grilled Salmon',
          customer: 'John D.',
          status: 'completed',
          amount: 17.00,
          date: new Date()
        },
        {
          id: '2',
          meal: 'Vegetable Pasta',
          customer: 'Lisa K.',
          status: 'preparing',
          amount: 13.00,
          date: new Date()
        }
      ],
      inventory: [
        {
          id: '1',
          title: 'Grilled Salmon with Vegetables',
          servings: 2,
          price: 8.50,
          expiryDate: '2024-01-14',
          expiryTime: '20:00',
          status: 'active'
        },
        {
          id: '2',
          title: 'Vegetarian Pasta Primavera',
          servings: 3,
          price: 6.50,
          expiryDate: '2024-01-14',
          expiryTime: '19:30',
          status: 'active'
        }
      ]
    };

    return res.json({ success: true, data: restaurantData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch restaurant data' });
  }
});

// Get buyer dashboard data
router.get('/buyer', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // In a real app, this would fetch from database
    const buyerData = {
      recentActivity: [
        {
          id: '1',
          type: 'order',
          title: 'Ordered fresh vegetables from Green Valley Farm',
          time: '2 hours ago',
          icon: 'shopping-bag'
        },
        {
          id: '2',
          type: 'order',
          title: 'Reserved healthy meal from Fresh Bites Restaurant',
          time: '1 day ago',
          icon: 'utensils'
        }
      ],
      recommendations: [
        {
          id: '1',
          title: 'Fresh Organic Tomatoes',
          type: 'farmer',
          price: 2.50,
          distance: '2.3 km',
          rating: 4.8,
          image: '/api/placeholder/300/200'
        },
        {
          id: '2',
          title: 'Grilled Salmon with Vegetables',
          type: 'restaurant',
          price: 8.50,
          distance: '1.8 km',
          rating: 4.9,
          image: '/api/placeholder/300/200'
        }
      ],
      savedItems: [
        {
          id: '1',
          title: 'Mixed Organic Greens',
          type: 'farmer',
          price: 3.00,
          savedAt: new Date()
        }
      ]
    };

    return res.json({ success: true, data: buyerData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch buyer data' });
  }
});

// Get listings for browsing
router.get('/listings', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, category, search, sortBy, page = 1, limit = 20 } = req.query;

    // In a real app, this would query the database with filters
    const listings = [
      {
        id: '1',
        type: 'farmer',
        title: 'Fresh Organic Tomatoes',
        description: 'Locally grown organic tomatoes, perfect for salads and cooking',
        price: 2.50,
        originalPrice: 4.00,
        quantity: '5kg',
        location: 'Green Valley Farm',
        distance: '2.3 km',
        rating: 4.8,
        reviews: 24,
        expiryDate: '2024-01-15',
        image: '/api/placeholder/300/200',
        category: 'vegetables',
        organic: true,
        locallyGrown: true,
        nutritionalInfo: {
          calories: 18,
          protein: 0.9,
          carbs: 3.9,
          fiber: 1.2
        }
      },
      {
        id: '2',
        type: 'restaurant',
        title: 'Grilled Salmon with Vegetables',
        description: 'Fresh grilled salmon with seasonal roasted vegetables',
        price: 8.50,
        originalPrice: 15.00,
        quantity: '2 servings',
        location: 'Fresh Bites Restaurant',
        distance: '1.8 km',
        rating: 4.9,
        reviews: 156,
        expiryDate: '2024-01-14',
        expiryTime: '20:00',
        image: '/api/placeholder/300/200',
        category: 'main-course',
        isHot: true,
        isVegetarian: false,
        nutritionalInfo: {
          calories: 450,
          protein: 35,
          carbs: 25,
          fat: 22
        }
      }
    ];

    // Apply filters
    let filteredListings = listings;

    if (type && type !== 'all') {
      filteredListings = filteredListings.filter(listing => listing.type === type);
    }

    if (category && category !== 'all') {
      filteredListings = filteredListings.filter(listing => listing.category === category);
    }

    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredListings = filteredListings.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'distance':
        filteredListings.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'price':
        filteredListings.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filteredListings.sort((a, b) => b.rating - a.rating);
        break;
      case 'expiry':
        filteredListings.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        break;
    }

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedListings = filteredListings.slice(startIndex, endIndex);

    return res.json({
      success: true,
      data: {
        listings: paginatedListings,
        total: filteredListings.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(filteredListings.length / Number(limit))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch listings' });
  }
});

export default router; 