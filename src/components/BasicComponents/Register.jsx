import { Controller,useForm } from "react-hook-form"
import AuthService from '../../appwrite/authService.js'
import { useNavigate } from "react-router-dom";
import localStorageService from "../../assets/localStorage.js";
import { useState } from "react";
import MainLoader from "../LoadingAnimation/MainLoader.jsx";
import {Container as Container,Divider, Typography,Box,InputLabel, FormControl, Button,Alert} from '@mui/material'
import { StyledCard } from "../Mui/MuiCustom.js";
import InputComponent from "../Mui/Input.jsx";
import GoogleIcon from '../Icon/GoogleIcon.png'
import AppwriteProfiles from "../../appwrite/appwriteProfiles.js";

export default function Register() {
    const { control, handleSubmit } = useForm({
      defaultValues:{
        name:'',
        email:'',
        password:''
      }
    });
    const [createusererror,setCreateusererror] = useState(false);
    const [loginError,setLoginError] = useState(false)
    const [errorName,setErrorName]=useState(false);
    const [errorEmail,setErrorEmail]=useState(false);
    const [errorPassword,setErrorPassword]=useState(false);
    const [registerStatus,setRegisterStatus] = useState(true)

     const navigate = useNavigate();


      const createUser =async (data) =>{
        data.name==''?setErrorName(true):setErrorName(false)
        data.email==''?setErrorEmail(true):setErrorEmail(false)
        data.password==''?setErrorPassword(true):setErrorPassword(false)
        if(!errorName && !errorEmail && !errorPassword){
          // console.log("hello")
          const {email,password} = data;
          
          setRegisterStatus(false);
          const register=await  AuthService.createAccount(data)
            register!==true?setCreateusererror(register):setCreateusererror(false)
            register!==true?setRegisterStatus(true):setRegisterStatus(false)
          if(register===true){
            const login = await AuthService.Login(email,password);
            loginError!==true?setLoginError(login):setLoginError(false);
            login!==true?setRegisterStatus(true):setRegisterStatus(false)
            if(login===true){
                  const user = await AuthService.getCurrentUser();
                  user? localStorageService.setData(user):null;
                  const result = await AppwriteProfiles.createProfile(user.$id,user.name,user.email);
                   if(result===true){
                    setRegisterStatus(true);
                    navigate('/')
                   }
                   else{
                    setLoginError(result)
                   }
                }
                else{
                  setLoginError(login)
                }
            }
           
        }     
        // console.log(data)
      }

      function handleGoogleLogin(){
        AuthService.LoginWithGoogle();
      }

      function handleLogin(){
        navigate("/login")
     }


     return  ( registerStatus)?(
      <Container maxWidth="lg" sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
         <StyledCard variant="outlined" sx={{ display:"grid",bgcolor:"inherit",p:{xs:"0.7rem",md:"2rem"},border:'1px solid',width:"30rem",backdropFilter:"blur(24px)"}}>
         
                 <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)',my:"1rem",color:"white" }}
                      >
                        Sign up
                  </Typography>
                  {createusererror || loginError?(<Alert variant="outlined" severity="error">
                   {createusererror?createusererror:loginError}
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
                         <InputLabel  sx={{color:"rgb(156 163 175)",}}>Name</InputLabel>
                          <FormControl>
                          <Controller
                       name="name"
                       control={control}
                       render={({field})=>(
                         <InputComponent field={field} type={"text"} placeholder={'John'} />
                         )}/>
                          </FormControl>
                         </Box>
                         <Box sx={{display:"grid"}}>
                         <InputLabel  sx={{color:"rgb(156 163 175)",}}>email</InputLabel>
                          <FormControl>
                        <Controller
                        name="email"
                        control={control}
                        render={({field})=>(
                          <InputComponent field={field} type={"email"} placeholder={'example@email.com'} />
                       )}
                       />
                          </FormControl>
                         </Box>
                         <Box sx={{display:"grid"}}>
                         <InputLabel  sx={{color:"rgb(156 163 175)",}}>password</InputLabel>
                          <FormControl>
                      <Controller
                       name="password"
                       control={control}
                       render={({field})=>(
                        <InputComponent field={field} type={"password"} placeholder={'.......'} />
                      )}
                       />
                          </FormControl>
                         </Box>
                         <Button onClick={handleSubmit(createUser)} variant="contained" color="primary" sx={{textTransform:"capitalize",height:"3rem",color:"black",bgcolor:"white",fontWeight:"500",border:"none",borderRadius:"0.5rem"}}>
                           sign up
                         </Button>

            <Divider sx={{my:"0.5rem",bgcolor:'rgb(75 85 99)'}}/>
             <Button 
              startIcon={<img className="h-[2.5rem]" src={GoogleIcon}/>}
             onClick={handleGoogleLogin} variant="outlined" sx={{color:"white",borderColor:"white",p:"0.5rem",borderRadius:"0.5rem"}}>sign in with google</Button>



           <Divider sx={{my:"0.5rem",bgcolor:'rgb(75 85 99)'}}/>
                       <Box sx={{display:"grid",gap:1}}>
                        <Typography variant="caption" sx={{color:"white"}}>already have an account ? click to login </Typography>
                        <Button onClick={()=>handleLogin()} variant="contained">sign in</Button>
                       </Box>
          </Box>
         </StyledCard>
      </Container>
      ):(<MainLoader/>)
}

