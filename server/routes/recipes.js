const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get recipe suggestions for ingredients
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { ingredients, tags, limit = 5 } = req.query;

    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const ingredientList = Array.isArray(ingredients) ? ingredients : [ingredients];

    // In a real implementation, this would call an external recipe API
    // For now, return mock suggestions based on ingredients
    const suggestions = [];

    if (ingredientList.some(ing => ing.toLowerCase().includes('tomato'))) {
      suggestions.push({
        id: 'recipe_1',
        title: 'Fresh Tomato Pasta',
        description: 'Simple and delicious pasta with fresh tomatoes and basil',
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        difficulty: 'easy',
        ingredients: [
          { name: 'tomatoes', amount: '4 medium', available: true },
          { name: 'pasta', amount: '200g', available: true },
          { name: 'olive oil', amount: '2 tbsp', available: false },
          { name: 'garlic', amount: '2 cloves', available: false },
          { name: 'basil', amount: '1/4 cup', available: false }
        ],
        instructions: [
          'Bring a large pot of salted water to boil',
          'Cook pasta according to package directions',
          'Meanwhile, dice tomatoes and mince garlic',
          'Heat olive oil in a pan and sauté garlic',
          'Add tomatoes and cook until softened',
          'Toss with cooked pasta and fresh basil'
        ],
        nutrition: {
          calories: 350,
          protein: 12,
          carbs: 45,
          fat: 15
        },
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
        missingIngredients: ['olive oil', 'garlic', 'basil'],
        missingCostCents: 350,
        confidenceScore: 0.85
      });
    }

    if (ingredientList.some(ing => ing.toLowerCase().includes('bread'))) {
      suggestions.push({
        id: 'recipe_2',
        title: 'Grilled Cheese Deluxe',
        description: 'Classic comfort food with a gourmet twist',
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        difficulty: 'easy',
        ingredients: [
          { name: 'bread', amount: '2 slices', available: true },
          { name: 'cheese', amount: '2 oz', available: true },
          { name: 'butter', amount: '1 tbsp', available: false },
          { name: 'tomato', amount: '1 slice', available: false }
        ],
        instructions: [
          'Butter one side of each bread slice',
          'Place cheese between bread slices',
          'Heat a pan over medium heat',
          'Cook until golden brown on both sides',
          'Add tomato slice if desired'
        ],
        nutrition: {
          calories: 280,
          protein: 8,
          carbs: 25,
          fat: 18
        },
        imageUrl: 'https://images.unsplash.com/photo-1528735602786-4692e6b44f19?w=400',
        missingIngredients: ['butter', 'tomato'],
        missingCostCents: 150,
        confidenceScore: 0.90
      });
    }

    if (ingredientList.some(ing => ing.toLowerCase().includes('chicken'))) {
      suggestions.push({
        id: 'recipe_3',
        title: 'Herb-Roasted Chicken',
        description: 'Simple roasted chicken with fresh herbs',
        prepTime: 10,
        cookTime: 45,
        servings: 4,
        difficulty: 'medium',
        ingredients: [
          { name: 'chicken breast', amount: '4 pieces', available: true },
          { name: 'olive oil', amount: '2 tbsp', available: false },
          { name: 'herbs', amount: '2 tbsp', available: false },
          { name: 'garlic', amount: '4 cloves', available: false },
          { name: 'lemon', amount: '1', available: false }
        ],
        instructions: [
          'Preheat oven to 400°F',
          'Season chicken with herbs, garlic, and lemon',
          'Drizzle with olive oil',
          'Roast for 40-45 minutes until golden',
          'Let rest for 5 minutes before serving'
        ],
        nutrition: {
          calories: 220,
          protein: 35,
          carbs: 2,
          fat: 8
        },
        imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
        missingIngredients: ['olive oil', 'herbs', 'garlic', 'lemon'],
        missingCostCents: 450,
        confidenceScore: 0.75
      });
    }

    if (ingredientList.some(ing => ing.toLowerCase().includes('vegetable'))) {
      suggestions.push({
        id: 'recipe_4',
        title: 'Roasted Vegetable Medley',
        description: 'Colorful and nutritious roasted vegetables',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'easy',
        ingredients: [
          { name: 'mixed vegetables', amount: '4 cups', available: true },
          { name: 'olive oil', amount: '3 tbsp', available: false },
          { name: 'garlic', amount: '3 cloves', available: false },
          { name: 'herbs', amount: '1 tbsp', available: false },
          { name: 'salt and pepper', amount: 'to taste', available: false }
        ],
        instructions: [
          'Preheat oven to 425°F',
          'Cut vegetables into uniform pieces',
          'Toss with olive oil, garlic, and herbs',
          'Season with salt and pepper',
          'Roast for 25-30 minutes until tender'
        ],
        nutrition: {
          calories: 120,
          protein: 4,
          carbs: 18,
          fat: 6
        },
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        missingIngredients: ['olive oil', 'garlic', 'herbs', 'salt and pepper'],
        missingCostCents: 200,
        confidenceScore: 0.80
      });
    }

    // Sort by confidence score and limit results
    suggestions.sort((a, b) => b.confidenceScore - a.confidenceScore);
    const limitedSuggestions = suggestions.slice(0, parseInt(limit));

    res.json({
      suggestions: limitedSuggestions,
      totalFound: suggestions.length
    });
  } catch (error) {
    console.error('Get recipe suggestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recipe by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // In a real implementation, this would fetch from external API or database
    // For now, return mock data
    const recipe = {
      id: id,
      title: 'Fresh Tomato Pasta',
      description: 'Simple and delicious pasta with fresh tomatoes and basil',
      prepTime: 15,
      cookTime: 20,
      servings: 2,
      difficulty: 'easy',
      ingredients: [
        { name: 'tomatoes', amount: '4 medium', available: true },
        { name: 'pasta', amount: '200g', available: true },
        { name: 'olive oil', amount: '2 tbsp', available: false },
        { name: 'garlic', amount: '2 cloves', available: false },
        { name: 'basil', amount: '1/4 cup', available: false }
      ],
      instructions: [
        'Bring a large pot of salted water to boil',
        'Cook pasta according to package directions',
        'Meanwhile, dice tomatoes and mince garlic',
        'Heat olive oil in a pan and sauté garlic',
        'Add tomatoes and cook until softened',
        'Toss with cooked pasta and fresh basil'
      ],
      nutrition: {
        calories: 350,
        protein: 12,
        carbs: 45,
        fat: 15
      },
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
      tags: ['vegetarian', 'quick', 'healthy']
    };

    res.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search recipes
router.get('/search', auth, async (req, res) => {
  try {
    const { q, diet, maxTime, difficulty, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // In a real implementation, this would search external recipe APIs
    // For now, return mock search results
    const mockRecipes = [
      {
        id: 'search_1',
        title: 'Quick Pasta Primavera',
        description: 'Fresh vegetables with pasta',
        prepTime: 10,
        cookTime: 15,
        difficulty: 'easy',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300'
      },
      {
        id: 'search_2',
        title: 'Grilled Vegetable Sandwich',
        description: 'Healthy vegetarian sandwich',
        prepTime: 15,
        cookTime: 10,
        difficulty: 'easy',
        imageUrl: 'https://images.unsplash.com/photo-1528735602786-4692e6b44f19?w=300'
      }
    ];

    // Filter by search query
    let filteredRecipes = mockRecipes;
    if (q) {
      filteredRecipes = mockRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(q.toLowerCase()) ||
        recipe.description.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Filter by max time
    if (maxTime) {
      const maxTimeMinutes = parseInt(maxTime);
      filteredRecipes = filteredRecipes.filter(recipe => 
        (recipe.prepTime + recipe.cookTime) <= maxTimeMinutes
      );
    }

    // Filter by difficulty
    if (difficulty) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.difficulty === difficulty
      );
    }

    // Paginate results
    const paginatedRecipes = filteredRecipes.slice(offset, offset + parseInt(limit));

    res.json({
      recipes: paginatedRecipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredRecipes.length,
        pages: Math.ceil(filteredRecipes.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;