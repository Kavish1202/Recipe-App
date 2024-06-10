const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

// Get all recipes
router.get('/recipes', async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

// Get a single recipe
router.get('/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    res.send(recipe);
  } catch (err) {
    next(err);
  }
});

// Create a new recipe
router.post('/recipes', async (req, res, next) => {
  try {
    const recipe = new Recipe(req.body);
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    next(err);
  }
});

// Update a recipe
router.put('/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    res.send(recipe);
  } catch (err) {
    next(err);
  }
});

// Delete a recipe
router.delete('/recipes/:id', async (req, res, next) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
