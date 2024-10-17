
import './App.css'

import HomePage from './pages/homepage/homePage'
import SignUpLogIn from './pages/signUpLogIn/signUp-LogIn'
import { RouterProvider, createBrowserRouter, Outlet, useLocation  } from 'react-router-dom'
import NavBar from './components/NavBar/navBar';
import Tutorials from './pages/tutorials/tutorials';
import About from './pages/About/about';
import Account from './pages/Account/account';

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
        element: <HomePage /> // HomePage wrapped with NavBar due to MainLayout
      },
      {
        path: 'users/:userId/tutorials',
        element: <Tutorials />
      },
      {
        path: 'users/:userId/about',
        element: <About />
      },
      {
        path: 'users/:userId/tutorials',
        element: <Account />
      },
      {
        path: 'users/:userId/account',
        element: <Account />
      }
    ]
  }
]);

// App component rendering the RouterProvider
function App() {
  return <RouterProvider router={router} />;
}

export default App;