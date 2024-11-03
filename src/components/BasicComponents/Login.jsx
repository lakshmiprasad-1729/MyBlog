/* eslint-disable react/no-unescaped-entities */
import { useForm ,Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import AuthService from "../../appwrite/authService.js";
import { useState } from "react";
import localStorageService from "../../assets/localStorage.js";
import MainLoader from "../LoadingAnimation/MainLoader.jsx";
import {Container as Container,Divider, Typography,Box,InputLabel, Button,Alert} from '@mui/material'
import { StyledCard } from "../Mui/MuiCustom.js";
import InputComponent from "../Mui/Input.jsx";
import GoogleIcon from '../Icon/GoogleIcon.png'

export default function Login() {
    const { control, handleSubmit } = useForm({
      defaultValues:{
        password:'',
        email:''
      }
    });
    const [loginStatus,setLoginStatus] = useState(true)
    const [loginError,setLoginError] = useState(false)


    const navigate = useNavigate();

      async function HandleLogin(data){
        setLoginStatus(false);
        const {email,password} = data;
       const login =await AuthService.Login(email,password);
       login!==true?setLoginError(login):setLoginError(false)
       login!==true?setLoginStatus(true):setLoginStatus(false)
        if (login===true) {
          const userdata = await AuthService.getCurrentUser()
          localStorageService.setData(userdata);
          setLoginStatus(true);
          navigate("/")
      }
    }

    function handleGoogleLogin(){
      AuthService.LoginWithGoogle();
    }
   
  
      function handleRegister(){
         navigate("/register")
      }  
  return ( loginStatus)?(
  <Container maxWidth="lg" sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
     <StyledCard variant="outlined" sx={{bgcolor:"inherit",p:{xs:"0.7rem",md:"2rem"},border:'1px solid',width:"30rem",backdropFilter:"blur(24px)"}}>
                     <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)',my:"1rem",color:"white" }}
                          >
                            Sign in
                          </Typography>   
                          { loginError?(<Alert variant="outlined" severity="error">
                           {loginError}
                         </Alert>):null}
       <Box
      component={'form'}
      sx={{
        display:"flex",
        flexDirection:"column",
        gap:2
      }}
      >
                <Box sx={{display:"grid"}}>
                 <InputLabel  sx={{color:"rgb(156 163 175)",}}>email</InputLabel>
                   <Controller
                   name="email"
                   control={control}
                   render={({field})=>(
                   <InputComponent field={field}  type={"email"} placeholder={"example@email.com"}/>
                   )}
                   />
                 </Box>
                 <Box sx={{display:"grid"}}>
                 <InputLabel  sx={{color:"rgb(156 163 175)",}}>password</InputLabel>
                 <Controller
                   name="password"
                   control={control}
                   render={({field})=>(
                    <InputComponent field={field} type={"password"} placeholder={"....."}/>
                   )}
                   />
                 </Box>
                 <Button 
                 variant="contained" onClick={handleSubmit(HandleLogin)} color="primary" sx={{textTransform:"capitalize",height:"3rem",color:"black",bgcolor:"white",fontWeight:"500",border:"none",borderRadius:"0.5rem"}}>
                   sign in
                 </Button>
      <Divider sx={{my:"0.5rem",bgcolor:'rgb(75 85 99)'}}/>
             <Button 
              startIcon={<img className="h-[2.5rem]" src={GoogleIcon}/>}
             onClick={handleGoogleLogin} variant="outlined" sx={{color:"white",borderColor:"white",p:"0.5rem",borderRadius:"0.5rem"}}>sign in with google</Button>

      <Divider sx={{my:"0.5rem",bgcolor:'rgb(75 85 99)'}}/>
                   <Box sx={{display:"grid",gap:1}}>
                    <Typography variant="caption" sx={{color:"white"}}>already have an account ? click to login </Typography>
                    <Button onClick={handleRegister} variant="contained">Register</Button>
                   </Box>
      </Box>
     </StyledCard>
  </Container>
  ):(<MainLoader/>)
}

