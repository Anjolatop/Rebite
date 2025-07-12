import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class RecipeController {
  getRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, category, difficulty } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      let query = db('recipes')
        .select('*')
        .where('is_active', true);

      if (category) {
        query = query.where('category', category);
      }

      if (difficulty) {
        query = query.where('difficulty', difficulty);
      }

      const recipes = await query
        .orderBy('created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await query.clone().count('* as count').first();
      const totalCount = Number(total?.count) || 0;
      res.json({
        success: true,
        data: recipes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get recipes error:', error);
      throw createError('Failed to get recipes', 500);
    }
  };

  getSuggestions = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      // Get user preferences
      const preferences = await db('user_preferences')
        .where('user_id', userId)
        .first();

      // Get user's recent purchases
      const recentItems = await db('order_items')
        .join('listings', 'order_items.listing_id', 'listings.id')
        .select('listings.title', 'listings.category')
        .where('order_items.user_id', userId)
        .orderBy('order_items.created_at', 'desc')
        .limit(10);

      // Get personalized recipe suggestions
      const suggestions = await db('recipes')
        .select('*')
        .where('is_active', true)
        .orderBy('rating', 'desc')
        .limit(5);

      res.json({
        success: true,
        data: {
          suggestions,
          recentItems
        }
      });
    } catch (error) {
      console.error('Get suggestions error:', error);
      throw createError('Failed to get suggestions', 500);
    }
  };

  generateRecipe = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    try {
      const { ingredients, dietaryPreferences, allergies, cookingTime, difficulty, servings } = req.body;

      // In a real implementation, this would call an AI service
      // For now, we'll return a mock recipe
      const mockRecipe = {
        title: 'Quick Stir Fry',
        description: 'A delicious stir fry using your available ingredients',
        ingredients: ingredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.quantity || '1',
          unit: ing.unit || 'piece'
        })),
        instructions: [
          'Heat oil in a wok or large pan',
          'Add vegetables and stir fry for 5 minutes',
          'Add protein and cook until done',
          'Season with salt and pepper',
          'Serve hot'
        ],
        cookingTime: cookingTime || 20,
        difficulty: difficulty || 'easy',
        servings: servings || 2,
        nutritionInfo: {
          calories: 300,
          protein: 15,
          carbs: 25,
          fat: 12
        }
      };

      res.json({
        success: true,
        data: mockRecipe
      });
    } catch (error) {
      console.error('Generate recipe error:', error);
      throw createError('Failed to generate recipe', 500);
    }
  };

  getRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const recipe = await db('recipes')
        .where('id', id)
        .where('is_active', true)
        .first();

      if (!recipe) {
        res.status(404).json({
          error: true,
          message: 'Recipe not found'
        });
        return;
      }

      res.json({
        success: true,
        data: recipe
      });
    } catch (error) {
      console.error('Get recipe error:', error);
      throw createError('Failed to get recipe', 500);
    }
  };

  rateRecipe = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: true, 
        message: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { rating, review } = req.body;

      // Check if user has already rated
      const existingRating = await db('recipe_ratings')
        .where('recipe_id', id)
        .where('user_id', userId)
        .first();

      if (existingRating) {
        res.status(400).json({
          error: true,
          message: 'You have already rated this recipe'
        });
        return;
      }

      // Add rating
      await db('recipe_ratings').insert({
        recipe_id: id,
        user_id: userId,
        rating,
        review
      });

      // Update recipe average rating
      const avgRating = await db('recipe_ratings')
        .avg('rating as average')
        .where('recipe_id', id)
        .first();

      await db('recipes')
        .where('id', id)
        .update({
          rating: avgRating?.average || rating
        });

      res.json({
        success: true,
        message: 'Recipe rated successfully'
      });
    } catch (error) {
      console.error('Rate recipe error:', error);
      throw createError('Failed to rate recipe', 500);
    }
  };

  getRecipeReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const reviews = await db('recipe_ratings')
        .join('users', 'recipe_ratings.user_id', 'users.id')
        .join('profiles', 'users.id', 'profiles.user_id')
        .select(
          'recipe_ratings.*',
          'profiles.first_name',
          'profiles.last_name'
        )
        .where('recipe_ratings.recipe_id', id)
        .orderBy('recipe_ratings.created_at', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await db('recipe_ratings')
        .where('recipe_id', id)
        .count('* as count')
        .first();

      res.json({
        success: true,
        data: reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total?.count) || 0,
          pages: Math.ceil((Number(total?.count) || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get recipe reviews error:', error);
      throw createError('Failed to get recipe reviews', 500);
    }
  };

  toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const existingFavorite = await db('recipe_favorites')
        .where('recipe_id', id)
        .where('user_id', userId)
        .first();

      if (existingFavorite) {
        await db('recipe_favorites')
          .where('recipe_id', id)
          .where('user_id', userId)
          .del();

        res.json({
          success: true,
          message: 'Removed from favorites',
          isFavorite: false
        });
      } else {
        await db('recipe_favorites').insert({
          recipe_id: id,
          user_id: userId
        });

        res.json({
          success: true,
          message: 'Added to favorites',
          isFavorite: true
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      throw createError('Failed to toggle favorite', 500);
    }
  };

  getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const favorites = await db('recipe_favorites')
        .join('recipes', 'recipe_favorites.recipe_id', 'recipes.id')
        .select('recipes.*')
        .where('recipe_favorites.user_id', userId)
        .where('recipes.is_active', true)
        .orderBy('recipe_favorites.created_at', 'desc');

      res.json({
        success: true,
        data: favorites
      });
    } catch (error) {
      console.error('Get favorites error:', error);
      throw createError('Failed to get favorites', 500);
    }
  };

  getTrendingRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .orderBy('rating', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get trending recipes error:', error);
      throw createError('Failed to get trending recipes', 500);
    }
  };

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await db('recipes')
        .select('category')
        .count('* as count')
        .where('is_active', true)
        .groupBy('category')
        .orderBy('count', 'desc');

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Get categories error:', error);
      throw createError('Failed to get categories', 500);
    }
  };

  getRecipesByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const recipes = await db('recipes')
        .select('*')
        .where('category', category)
        .where('is_active', true)
        .orderBy('rating', 'desc')
        .limit(Number(limit))
        .offset(offset);

      const total = await db('recipes')
        .where('category', category)
        .where('is_active', true)
        .count('* as count')
        .first();

      res.json({
        success: true,
        data: recipes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total?.count) || 0,
          pages: Math.ceil((Number(total?.count) || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get recipes by category error:', error);
      throw createError('Failed to get recipes by category', 500);
    }
  };

  searchRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query, category, difficulty, cookingTime } = req.query;

      let searchQuery = db('recipes')
        .select('*')
        .where('is_active', true);

      if (query) {
        searchQuery = searchQuery.where(function() {
          this.where('title', 'ilike', `%${query}%`)
            .orWhere('description', 'ilike', `%${query}%`)
            .orWhere('ingredients', 'ilike', `%${query}%`);
        });
      }

      if (category) {
        searchQuery = searchQuery.where('category', category);
      }

      if (difficulty) {
        searchQuery = searchQuery.where('difficulty', difficulty);
      }

      if (cookingTime) {
        searchQuery = searchQuery.where('cooking_time', '<=', Number(cookingTime));
      }

      const recipes = await searchQuery
        .orderBy('rating', 'desc')
        .limit(20);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Search recipes error:', error);
      throw createError('Failed to search recipes', 500);
    }
  };

  getQuickMeals = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .where('cooking_time', '<=', 30)
        .orderBy('rating', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get quick meals error:', error);
      throw createError('Failed to get quick meals', 500);
    }
  };

  getBudgetFriendlyRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .where('cost_level', 'budget')
        .orderBy('rating', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get budget friendly recipes error:', error);
      throw createError('Failed to get budget friendly recipes', 500);
    }
  };

  getHealthyRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .where('health_score', '>=', 8)
        .orderBy('health_score', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get healthy recipes error:', error);
      throw createError('Failed to get healthy recipes', 500);
    }
  };

  getSeasonalRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const season = currentMonth >= 3 && currentMonth <= 5 ? 'spring' :
                    currentMonth >= 6 && currentMonth <= 8 ? 'summer' :
                    currentMonth >= 9 && currentMonth <= 11 ? 'autumn' : 'winter';

      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .whereRaw("seasons @> ?", [JSON.stringify([season])])
        .orderBy('rating', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get seasonal recipes error:', error);
      throw createError('Failed to get seasonal recipes', 500);
    }
  };

  getRecipesByIngredient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ingredient } = req.params;

      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .whereRaw("ingredients @> ?", [JSON.stringify([ingredient])])
        .orderBy('rating', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get recipes by ingredient error:', error);
      throw createError('Failed to get recipes by ingredient', 500);
    }
  };

  getRecipesByCookingTime = async (req: Request, res: Response): Promise<void> => {
    try {
      const { time } = req.params;

      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .where('cooking_time', '<=', Number(time))
        .orderBy('cooking_time', 'asc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get recipes by cooking time error:', error);
      throw createError('Failed to get recipes by cooking time', 500);
    }
  };

  getRecipesByDifficulty = async (req: Request, res: Response): Promise<void> => {
    try {
      const { level } = req.params;

      const recipes = await db('recipes')
        .select('*')
        .where('is_active', true)
        .where('difficulty', level)
        .orderBy('rating', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Get recipes by difficulty error:', error);
      throw createError('Failed to get recipes by difficulty', 500);
    }
  };

  getNutritionalInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recipeId } = req.params;

      const recipe = await db('recipes')
        .select('nutrition_info')
        .where('id', recipeId)
        .first();

      if (!recipe) {
        res.status(404).json({
          error: true,
          message: 'Recipe not found'
        });
        return;
      }

      res.json({
        success: true,
        data: recipe.nutrition_info
      });
    } catch (error) {
      console.error('Get nutritional info error:', error);
      throw createError('Failed to get nutritional info', 500);
    }
  };

  generateShoppingList = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recipes } = req.body;

      // In a real implementation, this would analyze recipe ingredients
      // and generate a consolidated shopping list
      const shoppingList = [
        { item: 'Onions', quantity: 2, unit: 'pieces' },
        { item: 'Garlic', quantity: 4, unit: 'cloves' },
        { item: 'Olive Oil', quantity: 1, unit: 'tbsp' },
        { item: 'Salt', quantity: 1, unit: 'tsp' }
      ];

      res.json({
        success: true,
        data: shoppingList
      });
    } catch (error) {
      console.error('Generate shopping list error:', error);
      throw createError('Failed to generate shopping list', 500);
    }
  };

  generateMealPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { days = 7 } = req.query;

      // In a real implementation, this would use AI to generate personalized meal plans
      const mealPlan = {
        days: days,
        meals: [
          {
            day: 'Monday',
            breakfast: 'Oatmeal with berries',
            lunch: 'Grilled chicken salad',
            dinner: 'Salmon with vegetables'
          }
        ]
      };

      res.json({
        success: true,
        data: mealPlan
      });
    } catch (error) {
      console.error('Generate meal plan error:', error);
      throw createError('Failed to generate meal plan', 500);
    }
  };

  saveMealPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const mealPlanData = req.body;

      await db('meal_plans').insert({
        user_id: userId,
        plan_data: JSON.stringify(mealPlanData),
        start_date: new Date()
      });

      res.json({
        success: true,
        message: 'Meal plan saved successfully'
      });
    } catch (error) {
      console.error('Save meal plan error:', error);
      throw createError('Failed to save meal plan', 500);
    }
  };
} 