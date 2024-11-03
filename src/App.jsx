// import Login from './components/Login.jsx'
// import Register from './components/Register.jsx'
import { Box } from '@mui/material'
import {  Outlet } from 'react-router-dom'
import './index.css'
import Navbar from './components/BasicComponents/Navbar.jsx'

function App() {


    return (
      <Box className='w-[100dvw] min-h-[100dvh] flex justify-center bg-gradient-to-r from-black  to-custom1'>
          <div className='overflow-x-hidden overscroll-x-none'>
             <div>
             <Navbar/>
             </div>
             <div className='w-full'>
              <Outlet/>
             </div>
          </div>
    </Box>
    )
}

export default App
