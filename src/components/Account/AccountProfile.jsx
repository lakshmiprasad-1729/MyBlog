import { Container,Avatar,Typography, Box,Grid2 as Grid, Button, Alert, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react";
import localStorageService from "../../assets/localStorage";
import AppwriteSubscribe from "../../appwrite/appwriteSubscribe";
import { useNavigate } from "react-router-dom";

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

    function stringToColor(string) {
        let hash = 0;
        let i;
      
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.substr(-2);
        }      
        return color;
      }

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
                    
                      <Button key={index} display={"grid"} onClick={()=>navigate(`/view-account/${singledoc.owner}`)}>
                        <Avatar sx={{bgcolor:(()=>stringToColor(singledoc.ownerName)),width:"3rem",height:"3rem",color:"white"}}>{singledoc.ownerName.charAt(0)}</Avatar>
                        <Typography variant="caption" sx={{color:'white',textTransform:'capitalize',textAlign:"center",p:"0.25rem"}}>{singledoc.ownerName}</Typography>
                      </Button>
        
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