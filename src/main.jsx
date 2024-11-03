import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from './components/BasicComponents/Register.jsx';
import './index.css'
import Login from './components/BasicComponents/Login.jsx';
import Container from './components/container.jsx';
import Store from './Store/Store.js';
import { Provider } from 'react-redux';
import { lazy ,Suspense } from 'react';
import Allposts from './components/Posts/Allposts.jsx';
import Myposts from './components/Posts/Myposts.jsx';
import Readpost from './components/Readpost/Readpost.jsx';
import MainLoader from './components/LoadingAnimation/MainLoader.jsx';
import Account from './components/Account/Account.jsx';
import NotFound404 from './components/LoadingAnimation/NotFound404.jsx';
import Navbar from './components/BasicComponents/Navbar.jsx';
import { Box } from '@mui/material';
import ReadMyPost from './components/Readpost/ReadMypost.jsx';
import UpdatePost from './components/Posts/UpdatePost.jsx';
import HandleGoogleLogin from './components/handleGoogleLogin.jsx';

const TinyEditor = lazy(()=> import('./components/Editor/Editor.jsx'));
const LoadedApp = lazy(()=>import('./App.jsx'))

const router = createBrowserRouter([
  {
    path: "/",
    element:<Suspense>
      <Container>
      <LoadedApp/>
    </Container>
    </Suspense>,
  errorElement:<Container>
    <Navbar/>
    <NotFound404/>
  </Container>,
    children:[
      {
          path:'/',
          element:<Allposts/>
      },
      {
          path:'/:secret/:userId',
          element:<HandleGoogleLogin/>
      },
      {
         path:"/add-post",
         element:<Suspense fallback={<MainLoader/>}>
          <TinyEditor/>
         </Suspense>
       },
       {
          path:'/my-post',
          element:<Myposts/>
       },
      {
        path:'/read-post/:fileId',
        element:<Readpost/>
      },
      {
        path:'/read-my-post/:fileId',
        element:<ReadMyPost/>
      },
      {
        path:'/read-my-post/edit/:fileId',
        element:<UpdatePost/>
      },
      {
        path:'/account',
        element:<Container>
          <Account/>
        </Container>
      }
    ]
  },
  {
    path:"/register",
    element:<Box className='w-[100dvw] min-h-[100dvh] flex justify-center bg-gradient-to-r from-black  to-custom1'>
    <Register/>
  </Box>
  },
  {
    path:"/login",
    element:<Box className='w-[100dvw] min-h-[100dvh] flex justify-center bg-gradient-to-r from-black  to-custom1'>
      <Login/>
    </Box>
  },
]);

const root = createRoot(document.getElementById('root'))

root.render(
      <Provider store={Store}>
      <RouterProvider router={router} />
      </Provider>,

)