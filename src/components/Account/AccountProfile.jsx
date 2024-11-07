import { Container,Avatar,Typography, Box,Grid2 as Grid, Button, Alert, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react";
import localStorageService from "../../assets/localStorage";
import AppwriteSubscribe from "../../appwrite/appwriteSubscribe";
import { useNavigate } from "react-router-dom";
import FollowersProfile from './userProfile'

function AccountProfile() {
    const navigate = useNavigate();
    const [user,setUser]=useState(false);
    const [subscribedAccounts,setSubscribedAccounts] = useState();
    const [error,setError] = useState(false);
    const [followersCount,setFollowersCount] = useState(false);


    useEffect(()=>{
       let data = JSON.parse(localStorageService.getData());
       setUser(data.userdata);
    },[])

    useEffect(()=>{
    if(user){
        AppwriteSubscribe.subscribedAccounts(user.$id)
        .then(data=>setSubscribedAccounts(data.documents))
        .catch(err=>setError(err))

        AppwriteSubscribe.checkFollowers(user.$id)
        .then(data=>setFollowersCount(data))
    }  
    },[user])



  return (
   user?(<Container maxWidth="lg" sx={{marginTop:"8rem"}}>
       {error? <Alert variant="outlined" severity="error" sx={{fontWeight:"bold"}}>{error}</Alert>:null}
       <Button variant="outlined" sx={{textTransform:"capitalize",my:"1rem",borderColor:"white",color:"white"}} 
       onClick={()=>navigate('/change-account-details')}
       >change Details</Button>
     <Grid>
       {
        user?(
        <Grid container justifyContent={"center"} gap={2}>
           <Grid container alignItems={"center"}>
           <Avatar sx={{bgcolor:'red',width:"4rem",height:"4rem",color:"white"}}>{user.name.charAt(0)}</Avatar>
            </Grid>
          <Grid>
           <Typography variant="h6" sx={{color:"white"}}>
               {user.name}
           </Typography>
              <Box display={"grid"}>
                 <Typography sx={{color:"white"}} variant="caption">{`followers:${typeof followersCount == 'number'?followersCount:''}`}</Typography>
                 <Typography sx={{color:"white"}} variant="caption">{`following:${(subscribedAccounts?subscribedAccounts.length:'')}`}</Typography>
                 <Typography sx={{color:"white"}} variant="caption">{`createdAt: ${new Date(user.$createdAt).toLocaleDateString()}`}</Typography>
               </Box>
          </Grid>
       </Grid>
        ):null
       }
     <Box sx={{mt:"2rem",border:"1px solid gray",padding:'1rem',borderRadius:"0.5rem"}}>
      <Typography variant="h5" sx={{color:"whitesmoke"}}>Following :</Typography>
          <Box sx={{m:"1rem",display:"flex",flexWrap:"wrap",gap:"0.8rem"}}>
              {subscribedAccounts?(
                subscribedAccounts.length!==0?(
                   subscribedAccounts.map((singledoc,index)=>(
                     <FollowersProfile key={index} docid={singledoc} handleLogin={()=>navigate(`/view-account/${singledoc.owner}`)}/>
                        ))
                ):<Typography sx={{display:"flex",justifyContent:"center",width:"100dvw",color:"white",textTransform:"capitalize"}} variant="h6"> No results exist</Typography>
                 
           
              ):<Box sx={{display:"flex",justifyContent:"center",width:"100dvw"}}> <CircularProgress/></Box>
            }
          </Box>
      </Box>
     </Grid>
   </Container>):user==null?(
    <Box sx={{width:"100dvw",height:"100dvh",display:"flex",justifyContent:"center",alignItems:"center"}}>
     <Grid>
     <Button variant="contained" onClick={()=>navigate('/login')}>Login</Button>
     <Button variant="contained" sx={{mx:"1rem"}} onClick={()=>navigate('/register')}>Register</Button>
     </Grid>
    </Box>
  ):null
)
}






export default AccountProfile