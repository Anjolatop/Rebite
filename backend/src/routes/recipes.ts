import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { RecipeController } from '../controllers/recipeController';

const router = Router();
const recipeController = new RecipeController();

// Validation middleware
const validateRecipeRequest = [
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('ingredients.*.name').trim().isLength({ min: 1 }).withMessage('Ingredient name is required'),
  body('ingredients.*.quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be positive'),
  body('ingredients.*.unit').optional().trim().isLength({ min: 1 }).withMessage('Unit is required'),
  body('dietaryPreferences').optional().isArray().withMessage('Dietary preferences must be an array'),
  body('allergies').optional().isArray().withMessage('Allergies must be an array'),
  body('cookingTime').optional().isInt({ min: 1 }).withMessage('Cooking time must be positive'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be at least 1'),
];

const validateRecipeRating = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review too long'),
];

// Routes
router.get('/', asyncHandler(recipeController.getRecipes));
router.get('/suggestions', asyncHandler(recipeController.getSuggestions));
router.post('/generate', validateRecipeRequest, asyncHandler(recipeController.generateRecipe));
router.get('/:id', asyncHandler(recipeController.getRecipe));
router.post('/:id/rate', validateRecipeRating, asyncHandler(recipeController.rateRecipe));
router.get('/:id/reviews', asyncHandler(recipeController.getRecipeReviews));
router.post('/:id/favorite', asyncHandler(recipeController.toggleFavorite));
router.get('/favorites', asyncHandler(recipeController.getFavorites));
router.get('/trending', asyncHandler(recipeController.getTrendingRecipes));
router.get('/categories', asyncHandler(recipeController.getCategories));
router.get('/categories/:category', asyncHandler(recipeController.getRecipesByCategory));
router.get('/search', asyncHandler(recipeController.searchRecipes));
router.get('/quick-meals', asyncHandler(recipeController.getQuickMeals));
router.get('/budget-friendly', asyncHandler(recipeController.getBudgetFriendlyRecipes));
router.get('/healthy', asyncHandler(recipeController.getHealthyRecipes));
router.get('/seasonal', asyncHandler(recipeController.getSeasonalRecipes));
router.get('/ingredients/:ingredient', asyncHandler(recipeController.getRecipesByIngredient));
router.get('/cooking-time/:time', asyncHandler(recipeController.getRecipesByCookingTime));
router.get('/difficulty/:level', asyncHandler(recipeController.getRecipesByDifficulty));
router.get('/nutritional-info/:recipeId', asyncHandler(recipeController.getNutritionalInfo));
router.post('/shopping-list', asyncHandler(recipeController.generateShoppingList));
router.get('/meal-plan', asyncHandler(recipeController.generateMealPlan));
router.post('/meal-plan', asyncHandler(recipeController.saveMealPlan));

export default router; 