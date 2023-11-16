import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import '../index.css'
function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='newheader'>
      <div className='logo'>
        <Link to='/'>PaxPal</Link>
      </div>
      <ul >
        {user ? (
          <div className='newheader'>
            <div className='headerbtn'>
              <li >
                <Link to="/dashboard">
                  <button>Log Entry</button>
                </Link>
              </li>
              <li>
                <Link to="/Import">
                  <button>Import Data</button>
                </Link>
              </li>
              <li>
                <Link to="/Graphs">
                  <button >Visualize</button>
                </Link>

              </li>
              <li>
                <Link to="/Survey">
                  <button>Survey</button>
                </Link>
              </li>
              <li>
                <button className='headerbtn' onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>


            </div>
          </div>
        ) : (
          <>
            <li>
              <Link to='/login'>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header >
  )
}

export default Header
