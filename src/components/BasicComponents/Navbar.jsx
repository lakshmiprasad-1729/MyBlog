import { NavLink , useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux';
import AuthService from '../../appwrite/authService.js'
import { useEffect, useState } from 'react';
import {authLogout} from '../../Store/authSlice.js'
import localStorageService from '../../assets/localStorage.js';
import { AppBar ,Container, styled, Toolbar ,Box ,ImageListItem ,Typography ,Drawer, MenuItem as muiMenuItem, IconButton,Divider, CircularProgress} from "@mui/material";
import MuiButton from '@mui/material/Button';
import Sharingan from '../Icon/sharingan.png'
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSearchParams } from "react-router-dom";


const StyledToolbar = styled(Toolbar)(()=>({
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    flexShrink:0,
    borderRadius:"0.8rem",
    backdropFilter:'blur(24px)',
    border:'1px solid',
    borderColor:"#1e293b",
    backgroundColor:"rgba(0, 0, 0, 0.4)"
}));

const Button = styled(MuiButton)(()=>({
    color:"white",
    ':hover':{bgcolor:"#1e293b"},
    '&:focus':{
        outline:'none'
    },
    fontSize:14,
    fontWeight:200,
    fontFamily:"monospace",
    textTransform:"capitalize"

}))

const MenuItem=styled(muiMenuItem)(()=>({
    border:"none",
    borderRadius:"0.5rem",
    px:"2px",
    py:"4px",
    ":hover":{
        bgcolor:"#374151"
    },
    fontSize:18
}))



export default function Navbar() {
    const [open,setOpen]= useState(false)
    const dispatch= useDispatch();
    const navigate = useNavigate();
    const [userStatus,setuserStatus] = useState(false)
    const [loading,setLoading] = useState(false);
    const [searchparams,setSearchParams] = useSearchParams();

   
useEffect(()=>{
    let user = JSON.parse(localStorageService.getData())
    let q=searchparams.get('secret')
    let p=searchparams.get('userId')
     if(!user.status && p && q ){
      AuthService.google(p,q)
      .then((data)=>typeof data==='object'?localStorageService.setData(data):null)
      .catch((error)=>console.log(error)
      )
      setuserStatus(true)
    }
    else
    user.status?setuserStatus(true):setuserStatus(false)
   
},[])
  

const navItems=[
    {
        id:1,
        link:"/",
        name:"Home"
    },
    {
        id:2,
        link:"/add-post",
        name:"addPost"
    },
    {
        id:3,
        link:"/my-post",
        name:"My Post"
    },
    {
        id:4,
        link:"/account",
        name:"My Account"
    }
]


async function HandleLogOut(){
    setLoading(true)
   const result = await AuthService.Logout()
    if(result===true){
        dispatch(authLogout());
        localStorageService.logoutData();
        setuserStatus(false)
        navigate('/')
    }
    else{
        setLoading(false)
    }
}

function handleDrawer(){
    setOpen((prev)=>!prev)
}


return(
    <AppBar
        position="fixed"
        sx={{
            boxShadow: 0,
            bgcolor: 'transparent',
            backgroundImage: 'none',
            mt: '28px'
        }}
    >
        <Container maxWidth="lg">
           <StyledToolbar variant="dense" disableGutters>
           <Box sx={{display:"flex",alignItems:"center"}}>
              <ImageListItem
              sx={{width:"4rem",display:"flex",color:"white"}}>
               <img
               className='animate-spin'
               loading="lazy"
               src={Sharingan} alt="imageLoading" />
              </ImageListItem>
               <Typography variant="body1" sx={{fontWeight:700}} color="white">My Blog</Typography>

               <Box>
                    <Box 
                    sx={{display:{xs:'none',md:'flex'},ml:"1rem"}}
                    >
                   {navItems.map((item)=>(
                        <Button key={item.id} variant="text" size="small">
                            <NavLink
                             to={item.link}
                             className={({ isActive })=>isActive?"text-white pointer-events-none":"text-gray-400 pointer-events-auto"}
                             >{item.name}</NavLink>
                            </Button>
                    ))}
                    </Box>
                 </Box>

           </Box>

            <Box sx={{display:(userStatus?"none":"flex")}}>
                <Box sx={{display:{xs:"none",md:"flex"} }}>
                   <MuiButton onClick={()=>navigate('/login')}  variant="outlined" sx={{fontSize:14,textTransform:"capitalize",p:"4px",mr:"4px",'&:focus':{outline:"none"},border:"none",color:"white"}}>Login</MuiButton>
                   <MuiButton onClick={()=>navigate('/register')} variant="contained" sx={{fontSize:14,textTransform:"capitalize",py:"2px",px:"4px",'&:focus':{outline:"none"},mr:"2rem",bgcolor:"white",color:"black"}}>Register</MuiButton>
                </Box>
            </Box>

            <Box sx={{display:(userStatus?"flex":"none")}}>
            {loading?  <CircularProgress/>:''}
               <MuiButton onClick={()=>HandleLogOut()} variant="contained" sx={{fontSize:14,textTransform:"capitalize",py:"2px",px:"4px",'&:focus':{outline:"none"},mr:"2rem",bgcolor:"white",color:"black",display:{xs:"none",md:"inline"}}}>Logout</MuiButton>
            </Box>

            <Box sx={{display:{xs:"flex",md:"none"},alignItems:"center"}} onClick={handleDrawer} >
               <MenuIcon sx={{border:"1px solid #475569",py:"3px",px:"6px",borderRadius:"4px","&:hover":{bgcolor:"#111827"},mr:"2rem"}}/>
            </Box>

            <Drawer
            anchor="top"
            open={open}
            onClose={handleDrawer}
            >
                <Box sx={{bgcolor:"black",display:"grid",color:"white",p:2}}
                >

                    <Box sx={{display:"flex",justifyContent:"flex-end"}}>
                         <IconButton  onClick={handleDrawer}>
                           <CloseRoundedIcon sx={{color:"white",border:'1px solid #475569',p:"4px",borderRadius:"0.5rem"}}/>
                         </IconButton>
                    </Box>

                    { <Box>
                         {navItems.map((item)=>(
                            <MenuItem key={item.id}>
                                 <NavLink
                                 to={item.link}
                                  className={({ isActive })=>isActive?"text-white pointer-events-none":"text-gray-400 pointer-events-auto"}
                             >{item.name}</NavLink>
                            </MenuItem>
                         ))}
                         <Divider sx={{my:3,bgcolor:"whitesmoke"}}/>
                         <Box sx={{display:(userStatus?"none":"grid"),gap:2}}>
                         <Button 
                         onClick={()=>navigate('/login')}
                         variant="outlined"
                         sx={{border:"1px solid white",p:"6px",textAlign:"center",borderRadius:"0.5rem",marginTop:1,'&:focus':{borderColor:"whitesmoke"}}}
                         >
                            Sign in
                         </Button>
                         <Button 
                         onClick={()=>navigate('/register')}
                         variant="contained"
                         sx={{p:"6px",textAlign:"center",color:"black",bgcolor:"white",borderRadius:"0.5rem"}}
                         >
                            Sign up
                         </Button>
                         </Box>


                        <Box sx={{display:(userStatus?"grid":"none")}}>
                      <Box sx={{display:"flex",marginTop:1,}}>
                         {loading?  <CircularProgress/>:''}
                      <Button
                         onClick={()=>HandleLogOut()}
                         variant="outlined"
                         sx={{border:"1px solid white",p:"6px",textAlign:"center",borderRadius:"0.5rem",'&:focus':{borderColor:"whitesmoke"}}}
                         >
                           Logout
                         </Button>
                        </Box>
                      </Box>
                     </Box>}
                </Box>
            </Drawer>

        
           </StyledToolbar>
        </Container>
    </AppBar>
)}
