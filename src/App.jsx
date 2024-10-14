
import './App.css'
import { UserProvider } from './contexts/UserContext'
import HomePage from './pages/homePage'
import SignUpLogIn from './pages/signUp-LogIn'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  

  return (
    <>
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/' element={ <SignUpLogIn />} />
            <Route path="/homepage/:id" element={<HomePage />} />
          
          </Routes>
        </Router>
      </UserProvider>
    </>
  )
}

export default App;
