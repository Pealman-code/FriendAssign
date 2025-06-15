import { createBrowserRouter } from 'react-router-dom';
import HomeLayouts from '../Layout/HomeLayouts';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthLayout from '../Layout/AuthLayout';
import Terms from '../pages/Terms';
import AllGroupDetails from '../Components/AllGroupDetails';
import ErrorPage from '../pages/ErrorPage';
import Profile from '../pages/Profile';
import MyGroup from '../pages/MyGroup';
import PrivateRoute from './PrivateRoute';
import UpdateGroup from '../pages/UpdateGroup';
import AllGroup from '../Components/AllGroup';
import CreateAssignment from '../pages/CreateAssignment';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayouts />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AllGroup />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'services/:id',
        element: <AllGroupDetails />,
      },

      {
        path: 'my-group',
        element: <MyGroup />,
      },
      {
        path: 'updateGroup/:id',
        element: <UpdateGroup />,
      },
    ],
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/profile',
    element: <Profile />,
    errorElement: <Profile />,
  },
  {
    path: 'create-assignments',
    element: <CreateAssignment />,
  },
]);

export default router;