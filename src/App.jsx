import './App.css';

import HomePage from './pages/homepage/homePage';
import SignUpLogIn from './pages/signUpLogIn/signUp-LogIn';
import { RouterProvider, createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar/navBar';
import Tutorials from './pages/tutorials/tutorials';
import About from './pages/About/about';
import Account from './pages/Account/account';
import ProtectedRoute from './components/protectedRoute'; // Path updated to match correct location of the ProtectedRoute

// Layout component that includes NavBar conditionally
function MainLayout() {
  const location = useLocation();

  return (
    <>
      {/* If the current path is not '/', render the NavBar */}
      {location.pathname !== '/' && <NavBar />}
      
      {/* Outlet renders the current page's content */}
      <Outlet />
    </>
  );
}

// Create the router object with routes
const router = createBrowserRouter([
  {
    element: <MainLayout />, // Main layout wrapper for routes
    children: [
      {
        path: '/', 
        element: <SignUpLogIn /> // No NavBar here because it's in the MainLayout condition
      },
      {
        path: '/users/:userId/home',  
        element: (
          <ProtectedRoute>
            <HomePage />  
          </ProtectedRoute>
        )
      },
      {
        path: '/users/:userId/tutorials',
        element: (
          <ProtectedRoute>
            <Tutorials /> 
          </ProtectedRoute>
        )
      },
      {
        path: '/users/:userId/about',
        element: (
          <ProtectedRoute>
            <About />  
          </ProtectedRoute>
        )
      },
      {
        path: '/users/:userId/account',
        element: (
          <ProtectedRoute>
            <Account />  
          </ProtectedRoute>
        )
      }
    ]
  }
]);

// App component rendering the RouterProvider
function App() {
  return <RouterProvider router={router} />;
}

export default App;
