
import './App.css'
import HomePage from './pages/homePage'
import SignUpLogIn from './pages/signUp-LogIn'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={ <SignUpLogIn />} />
          <Route path="/homepage" element={<HomePage />} />
        
        </Routes>
      </Router>
    </>
  )
}

export default App;
