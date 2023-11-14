const asyncHandler = require('express-async-handler')

const Meal = require('../models/mealModel')
const User = require('../models/userModel')

// @desc    Get meals
// @route   GET /api/meals
// @access  Private
const getMeals = asyncHandler(async (req, res) => {
  const meals = await Meal.find({ user: req.user.id })

  res.status(200).json(meals)
})

// @desc    Set meal
// @route   POST /api/meals
// @access  Private
const setMeal = asyncHandler(async (req, res) => {
  if(!req.body.mealName || !req.body.mealDate || !req.body.mealTime ||  !req.body.insulinDose || !req.body.insulinTime  ||!req.body.carbCount) {
    res.status(400)
    throw new Error('please add all fields')
  }

  const meal = await Meal.create({
    user: req.user.id,
    mealName: req.body.mealName,
    mealDate: req.body.mealDate,
    mealTime: req.body.mealTime,
    insulinDose: req.body.insulinDose,
    insulinTime: req.body.insulinTime,
    carbCount: req.body.carbCount
  })
  res.status(200).json(meal)
})

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private
const updateMeal = asyncHandler(async (req, res) => {
  const meal = await Meal.findById(req.params.id)

  if (!meal) {
    res.status(400)
    throw new Error('meal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the meal user
  if (meal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedmeal = await meal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedmeal)
})

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMeal = asyncHandler(async (req, res) => {
  const meal = await Meal.findById(req.params.id)

  if (!meal) {
    res.status(400)
    throw new Error('meal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the meal user
  if (meal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await meal.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getMeals,
  setMeal,
  updateMeal,
  deleteMeal,
}
