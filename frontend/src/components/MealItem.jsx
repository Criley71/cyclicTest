import { useDispatch } from 'react-redux'
import { deleteMeal } from '../features/meals/mealSlice'

function MealItem({ meal }) {
  const dispatch = useDispatch()

  var date = new Date(meal.mealDate)
  var dateMonth = date.toString().split(' ')[1]
  var dateDay = date.toString().split(' ')[2]
  var dateYear = date.toString().split(' ')[3] //this is dumb but works -\(-_-)/-
  // i refresh the page when delete because currently it shows something else being deleted but when you refresh it deletes the
  // one you actually deleted. redux is hell
  var mtimeConvert = meal.mealTime
  var mnumTime = mtimeConvert.split(':').map(x => +x)
  var mminutes = 0
  var mAMorPM = 'am'
  if (mnumTime[0] > 12) {
    mnumTime[0] = mnumTime[0] - 12
    mAMorPM = 'pm'
  }


  console.log(mnumTime[1])
  if (mnumTime[1] < 10) {

    mminutes = mnumTime[1].toString().padStart(2, '0')
  } else {

    mminutes = mnumTime[1]
  }

  let iTime = meal.insulinTime
  let splitITime = iTime.split(':').map(x => +x)
  let iAMorPM = 'am'
  let iMinutes = 0;
  if (splitITime[0] > 12) {
    splitITime[0] = splitITime[0] - 12
    iAMorPM = 'pm'
  }
  if (splitITime[1] < 10) {
    iMinutes = splitITime[1].toString().padStart(2, '0')
  } else {
    iMinutes = splitITime[1]
  }


  return (
      <div className='meal'>
      <h2>{meal.mealName}</h2>
      <div>
        {dateMonth + ' ' + dateDay + ', ' + dateYear + ' at ' + mnumTime[0] + ':' + mminutes + ' ' + mAMorPM}
      </div>
      <div>
        {meal.insulinDose + ' U/mL\'s of insulin at ' + splitITime[0] + ':' + iMinutes + ' ' + iAMorPM}
      </div>
      <div>
        {'Carb Count: ' + meal.carbCount}
      </div>
      
      <button onClick={() => {
        dispatch(deleteMeal(meal._id))
        window.location.reload()
      }} className='close'>
        X
      </button>
    </div>
  )
}

export default MealItem
