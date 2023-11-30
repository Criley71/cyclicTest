import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import MainPage from './pages/MainPage'
import CSVFileUploader from './pages/CSVFileUploader'
import Graphs from './pages/Graphs'
import Homepage from './pages/Homepage'
import ImportCSVPage from './pages/ImportCSVPage'
function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header className="headerTabs"/>
          <Routes>
            <Route path='/dashboard' element={< Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/' element={<MainPage />} />
            <Route path='/import' element={<ImportCSVPage/>}/>
            <Route path='/Home' element={<Homepage/>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
