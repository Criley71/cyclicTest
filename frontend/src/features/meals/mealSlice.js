import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mealService from './mealService'
//redux resources should have the isError, success, loading and message
const initialState = {
  meals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const createMeal = createAsyncThunk('meals/create', async (mealData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token //thunkapi allows us to get local storage from anywhere
    return await mealService.createMeal(mealData, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//get user meals
export const getMeals = createAsyncThunk('meals/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token //thunkapi allows us to get local storage from anywhere
    return await mealService.getMeals(token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//delete meal
export const deleteMeal = createAsyncThunk('meals/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token //thunkapi allows us to get local storage from anywhere
    return await mealService.deleteMeal(id, token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    reset: (state) => initialState //can reset to intial states as we want to reset meals
    //we didnt do it in authslice as the user persists
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createMeal.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.meals.push(action.payload) //push payload into meals array
      })
      .addCase(createMeal.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getMeals.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMeals.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.meals = action.payload //get meals via payload
      })
      .addCase(getMeals.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteMeal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let index = state.meals.indexOf(action.payload)
        state.meals.splice(index, 0)
        console.log(index)
        
      })
      .addCase(deleteMeal.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset } = mealSlice.actions
export default mealSlice.reducer
