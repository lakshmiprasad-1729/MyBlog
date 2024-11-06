import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Store from './Store/Store.js';
import { Provider } from 'react-redux';
import Allposts from './components/Posts/Allposts.jsx';
import Myposts from './components/Posts/Myposts.jsx';
import Readpost from './components/Readpost/Readpost.jsx';
import Account from './components/Account/Account.jsx';
import NotFound404 from './components/LoadingAnimation/NotFound404.jsx';
import Navbar from './components/BasicComponents/Navbar.jsx';
import { Box } from '@mui/material';
import ReadMyPost from './components/Readpost/ReadMypost.jsx';
import UpdatePost from './components/Posts/UpdatePost.jsx';
import Register from './components/BasicComponents/Register.jsx';
import './index.css'
import Login from './components/BasicComponents/Login.jsx';
import App from './App.jsx'
import TinyEditor from './components/Editor/Editor.jsx';
import AccountProfile from './components/Account/AccountProfile.jsx';
import UserAccount from './components/Account/userAccount.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element:<Box className='w-[100dvw] min-h-[100dvh] flex justify-center bg-gradient-to-r from-black  to-custom1'>
    <App/>
   </Box>,
  errorElement:  <Box className='w-[100dvw] min-h-[100dvh] flex justify-center bg-gradient-to-r from-black  to-custom1'>
    <Navbar/>
    <NotFound404/>
  </Box>,

    children:[
      {
          path:'/',
          element:<Allposts/>
      },
      {
         path:"/add-post",
         element:<TinyEditor/>
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
        element:
        <Box className='w-[100dvw] min-h-[100dvh] flex justify-center bg-gradient-to-r from-black  to-custom1'>
          <AccountProfile/>
          </Box>,
      }, 
      {
        path:'/change-account-details',
        element:
        <Box className='w-[100dvw] min-h-[100dvh] flex justify-center bg-gradient-to-r from-black  to-custom1'>
        <Account/>
        </Box>
      },{
        path:'/view-account/:userId',
        element:
        <UserAccount/>
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