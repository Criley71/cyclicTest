import {React, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import MealForm from '../components/MealForm'
import Spinner from '../components/Spinner'
import { getMeals, reset } from '../features/meals/mealSlice'
import MealItem from '../components/MealItem'
function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.auth)
  const { meals, isLoading, isError, message } = useSelector(
    (state) => state.meals
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
      return
    }

    dispatch(getMeals())

    return () => {
      dispatch(reset())
    }
    //window.location.reload() //it weird, have to refresh otherwise it shows as undefined until refresh
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }
  console.log(typeof(meals))
  return (
    <div className='page'>
    <section className="heading">
      <h1>Welcome {user && user.name}</h1>
      <p>PaxPal Meal Tracking</p>
    </section>
    < MealForm />
    
    <section className="content">
      {meals.length > 0 && Array.isArray(meals) ? ( 
      <div className='meals'>
       {meals.map((meal) => (
         <MealItem key={meal._id} meal={meal} />
        ))} 
      </div> ): (<h3>No Meals Entered Yet</h3>)}
    </section>

    
    </div>




  )
}

export default Dashboard
