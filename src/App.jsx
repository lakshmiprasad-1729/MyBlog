// import Login from './components/Login.jsx'
// import Register from './components/Register.jsx'
import {  Outlet } from 'react-router-dom'
import './index.css'
import Container from './components/container.jsx'
import Navbar from './components/BasicComponents/Navbar.jsx'

function App() {


    return (
      <Container>
          <div className='overflow-x-hidden overscroll-x-none'>
             <div>
             <Navbar/>
             </div>
             <div className='w-full'>
              <Outlet/>
             </div>
          </div>
      </Container>
    )
}

export default App
