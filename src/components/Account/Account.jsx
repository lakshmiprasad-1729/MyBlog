import { Box,Container,InputLabel,Grid2 as Grid, Button, CircularProgress, Alert} from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthService from "../../appwrite/authService"
import InputComponent from "../Mui/Input"
import localStorageService from "../../assets/localStorage"
import AppwriteProfiles from "../../appwrite/appwriteProfiles"

function Account() {
   const navigate = useNavigate();
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [oldPassword,setOldPassword] = useState(false)
    const [oldPassword1,setOldPassword1] = useState(false)
    const [loading,setLoading] = useState(false)
    const [status,setStatus] = useState(false);
    const [error,setError] = useState(false);
    const [user,setUser]=useState(false);
    const [profile,setProfile] = useState(true);

    useEffect(()=>{
      let data = JSON.parse(localStorageService.getData()).userdata;
      setUser(data);

      if(data){
         AppwriteProfiles.getDocument(data.$id)
      .then(data=>typeof data==='object'?(setProfile(data.documents[0])):setError(data))
      .catch(err=>setError(err))
      }
    },[])

    useEffect(()=>{
       if(error!==false){
        setTimeout(()=>setError(false),10000)
       }
    },[error])

    useEffect(()=>{
        if(status!==false){
         setTimeout(()=>setStatus(false),10000)
        }
     },[status])

    async function change(option){
       setError==false?null: setLoading(true);
        if(option==="name"){
           const update= await AuthService.updateName(name);
           setLoading(false)
           update!=true?setError(update):setError(false)
           if(!error){
             let result = await AppwriteProfiles.updateName(name,profile.$id);
             result === true?setStatus("Name"):setError(result)
           }
           setName('')
        }
        if(option==="email"){
            console.log(oldPassword1)
            const update =  await AuthService.updateEmail(email,oldPassword1);
            setLoading(false)
            update!=true?setError(update):setError(false)
            if(!error){
               let result = await AppwriteProfiles.updateEmail(email,profile.$id);
               result === true?setStatus("Email"):setError(result)
            }
            setEmail('')
            setOldPassword1('')
         }
         if(option==="password"){
            const update =  await AuthService.updatePassword(password,oldPassword);
            setLoading(false)
            update!=true?setError(update):setError(false)
            error?null:setStatus("password")
            setPassword('')
            setOldPassword('')
         }
         const user = await AuthService.getCurrentUser();
         user? localStorageService.setData(user):null;;
       
    }
  return (
     user?(
      <Container maxWidth="lg" sx={{display:"flex",justifyContent:"center",}}>
      <Grid gap={2} sx={{width:"30rem"}}>
             <Box sx={{marginTop:"8rem"}}>
             <Box sx={{display:(loading?'flex':'none'),justifyContent:"center",my:"1rem"}}> <CircularProgress/></Box>
             <Alert variant="outlined" severity="error" sx={{display:(error?'flex':'none'),my:"1rem"}}>{error}</Alert>
             <Alert variant="outlined" severity="success" sx={{display:(status && error==false?'flex':'none'),my:"1rem"}}>{`${status} changed successfully`}</Alert>
              <InputLabel sx={{color:"white"}}>Change Name</InputLabel>
                <InputComponent field={{onChange:(e)=>setName(e.target.value),value:name}} type={"text"} placeholder={"John"}/>
             <Box sx={{display:"flex",justifyContent:"flex-end"}}>
             <Button onClick={()=>change("name")} variant="contained" sx={{my:"0.5rem"}}>Change</Button>
             </Box>
             </Box>
                <Box>
                 <InputLabel sx={{color:"white"}}>Change Email</InputLabel>
                 <InputComponent field={{onChange:(e)=>setEmail(e.target.value),value:email}} type={"email"} placeholder={"example@email.com"}/>
                 <InputLabel sx={{color:"white",mt:"1.5rem"}}>Password </InputLabel>
                 <InputComponent field={{onChange:(e)=>setOldPassword1(e.target.value),value:oldPassword1}} type={"password"} placeholder={"......."}/>
                 <Box sx={{display:"flex",justifyContent:"flex-end"}}>
                <Button onClick={()=>change("email")} variant="contained"  sx={{my:"0.5rem"}}>Change</Button>
                </Box>
                </Box>
                   <Box>
                    <InputLabel sx={{color:"white"}}>New Password </InputLabel>
                    <InputComponent field={{onChange:(e)=>setPassword(e.target.value),value:password}} type={"password"} placeholder={"......."}/>
                    <InputLabel sx={{color:"white",mt:"1.5rem"}}>old Password </InputLabel>
                    <InputComponent field={{onChange:(e)=>setOldPassword(e.target.value),value:oldPassword}} type={"password"} placeholder={"......."}/>
                    <Box sx={{display:"flex",justifyContent:"flex-end"}}>
                   <Button onClick={()=>change("password")} variant="contained"  sx={{my:"0.5rem"}}>Change</Button>
                   </Box>
                   </Box>
      </Grid>
    </Container>
     ):(
      <Box sx={{width:"100dvw",height:"100dvh",display:"flex",justifyContent:"center",alignItems:"center"}}>
       <Grid >
       <Button variant="contained" onClick={()=>navigate('/login')}>Login</Button>
       <Button variant="contained" sx={{mx:"1rem"}} onClick={()=>navigate('/register')}>Register</Button>
       </Grid>
      </Box>
     )
  )
}

export default Account