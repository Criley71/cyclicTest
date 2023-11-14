import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createMeal } from '../features/meals/mealSlice'
import { MdFastfood } from 'react-icons/md'
import {GiSlicedBread} from 'react-icons/gi'
import {FaCalendarAlt, FaCalendarPlus, FaClock, FaSyringe} from 'react-icons/fa'

function MealForm() {
  const [mealName, setMealName] = useState('')
  const [mealDate, setMealDate] = useState(new Date())
  const [mealTime, setMealTime] = useState('')
  const [insulinDose, setInsulinDose] = useState(0)
  const [insulinTime, setInsulinTime] = useState('')
  const [carbCount, setCarbCount] = useState(0)

  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(createMeal({ mealName, mealDate, mealTime, insulinDose, insulinTime, carbCount }))
    setMealName('')
    setMealDate(new Date())
    setMealTime('')
    setInsulinDose(0)
    setInsulinTime('')
    setCarbCount(0)
  }

  return (
    <div className='page'>
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <MdFastfood size={35} />
            <label htmlFor="mealName">Meal Name</label>
            <input type="text" name="mealName" id="mealName" placeholder='Enter the name of the meal' className='inboxName' value={mealName} onChange={(e) => setMealName(e.target.value)} />
          </div>

          <div className="form-group">
          <FaCalendarAlt size={35} />
          <label htmlFor="mealDate">Meal Date</label>
          <input type="date" name="mealDate" id="mealDate" value={mealDate}  className='inbox-mealDate' onChange={(e) => setMealDate(e.target.value)} />
        </div>

        <div className="form-group">
        <FaClock size={35} />
          <label htmlFor="mealTime">Meal Time</label>
          <input type="time" name="mealTime" id="mealTime" value={mealTime}  className='inbox-mealTime' onChange={(e) => setMealTime(e.target.value)} />
        </div>

        <div className="form-group">
        <FaSyringe size={35} />
          <label htmlFor="insulinDose">Insulin Dose (U/mL)</label>
          <input type="number" name="insulinDose" id="insulinDose"  className='inbox-insulinDose' value={insulinDose} onChange={(e) => setInsulinDose(e.target.value)} />
        </div>

        <div className="form-group">
        <FaClock size={35} />
          <label htmlFor="insulinTime">Insulin Time</label>
          <input type="time" name="insulinTime" id="insulinTime"  className='inbox-insulinTime' value={insulinTime} onChange={(e) => setInsulinTime(e.target.value)} />
        </div>

        <div className="form-group">
        <GiSlicedBread size={35} />
          <label htmlFor="carbCount">Carb Count</label>
          <input type="number" name="carbCount" id="carbCount"  className='inbox-carbCount' value={carbCount} onChange={(e) => setCarbCount(e.target.value)} />
        </div>

          <div className='form-group'>
            <button className='btn btn-block' type='submit'>
              Add Meal
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default MealForm
