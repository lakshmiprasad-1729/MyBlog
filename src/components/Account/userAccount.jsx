import { Container,Avatar,Typography, Box,Grid2 as Grid, Button, Alert, CircularProgress} from "@mui/material"
import { useEffect, useState } from "react";
import AppwriteSubscribe from "../../appwrite/appwriteSubscribe";
import { useParams } from "react-router-dom";
import localStorageService from "../../assets/localStorage";
import DatabaseService from "../../appwrite/databaseService"
import Latest from "../Mui/Latest";
import AppwriteProfiles from "../../appwrite/appwriteProfiles";


function UserAccount() {
    const {userId}=useParams();
    const [user,setUser]=useState(false);
    const [currentUser,setCurrentUser] = useState(false);
    const [posts,setPosts] = useState(false);
    const [subscribeStatus,setSubscribeStatus] = useState(false);
    const [error,setError] = useState(false);
    const [subLoading,setSubLoading] = useState(true);
    const [followersCount,setFollowersCount] = useState(false);
    const [followingCount,setFollowingCount] = useState(false);

    useEffect(()=>{
     let data = JSON.parse(localStorageService.getData()).userdata;
     setCurrentUser(data);
    },[])
  //   axios.get(`/api/?userid=${userId}`)
  //  .then(data=>console.log(data.data))
  //  .catch(err=>console.log(err)
  //  )

    useEffect(()=>{
       if(userId){
       AppwriteProfiles.getDocument(userId)
       .then(data=>setUser(data.documents[0]))
      .catch(err=>setError(err))
       DatabaseService.listUserDocuments(userId)
       .then(data=>typeof data=='object'?(data.documents.length!=0?setPosts(data.documents):setPosts([])):setError(data))
       .catch(err=>setError(err))
       }
    },[])

    useEffect(()=>{
      if(user){
          AppwriteSubscribe.subscribedAccounts(user.userid)
          .then(data=>data?setFollowingCount(data.documents.length):null)
          .catch(err=>setError(err))
  
          AppwriteSubscribe.checkFollowers(user.userid)
          .then(data=>setFollowersCount(data))
      }  
      },[user])

    useEffect(()=>{
    if(currentUser && user ){
       AppwriteSubscribe.checkSubscribe(user.userid,currentUser.$id)
        .then(data=>typeof data=='object'?(data.documents.length!=0?setSubscribeStatus(data.documents[0]):null):setError(data))
        .catch(err=>setError(err))
        setSubLoading(false);
    }
    else{
      setSubLoading(false)
    }
    },[currentUser,user])

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

      useEffect(()=>{setTimeout(()=>setError(false),5000)},[error])

    async function toggleSubscription(){
      if(currentUser){
        setSubLoading(true);
      if(subscribeStatus){
        const result = await AppwriteSubscribe.unSubscribe(subscribeStatus.$id);
         result?setSubscribeStatus(false):null;
         const followers = await AppwriteSubscribe.checkFollowers(user.userid);
         setFollowersCount(followers);
         setSubLoading(false);
      }
      else{
         const result = await AppwriteSubscribe.Subscribe(user.userid,currentUser.$id,user.name);
         typeof result=='object'?setSubscribeStatus(result):null;
         const followers = await AppwriteSubscribe.checkFollowers(user.userid);
         setFollowersCount(followers);
         setSubLoading(false);
      }
      }
      else{
        setError('login to subscribe')
      }
    }

  return (
   <Container maxWidth="lg" sx={{marginTop:"8rem"}}>
       {error? <Alert variant="outlined" severity="error" sx={{fontWeight:"bold"}}>{error}</Alert>:null}
     <Grid>
       {
        user?(
        <Grid>
           <Grid container justifyContent={"center"} gap={2}>
            <Grid container alignItems={"center"}><Avatar sx={{bgcolor:(()=>stringToColor(user.name)),width:"4rem",height:"4rem",color:"white"}}>{user.name.charAt(0)}</Avatar>
            </Grid>
          <Grid>
           <Typography variant="h6" sx={{color:"white"}}>
               {user.name}
           </Typography>
              <Box display={"grid"}>
                 <Typography sx={{color:"white"}} variant="caption">{`following:${followingCount?(followingCount):followingCount==0?0:''}  `}</Typography>
                 <Typography sx={{color:"white"}} variant="caption">{`followers:${followersCount?(followersCount):followersCount==0?0:''}  `}</Typography>
                 <Typography sx={{color:"white"}} variant="caption">{`createdAt: ${user?(new Date(user.createdAt).toLocaleDateString()):''}`}</Typography>
               </Box>
          </Grid>
             {
                !subLoading?(
                  <Button variant="outlined" onClick={toggleSubscription} sx={{height:"2.5rem",textTransform:"capitalize",mx:"1.5rem",my:"1rem",borderColor:"white",color:"white"}} 
                  >{subscribeStatus?"unfollow":"follow"}</Button>
                ):(subLoading==null?(
                    <Button onClick={()=>setError('login to subscribe')} variant="outlined" sx={{height:"2.5rem",textTransform:"capitalize",mx:"1.5rem",my:"1rem",borderColor:"white",color:"white"}} 
                    >Follow</Button>
                ):<CircularProgress sx={{m:"1.5rem"}}/>)
                
             }
       </Grid>
        </Grid>
        ):(
          <div className="flex flex-row gap-2 w-full justify-center">
            <div className="animate-pulse bg-gray-300 w-12 h-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="animate-pulse bg-gray-300 w-28 h-5 rounded-full" />
              <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full" />
            </div>
          </div>
         )
       }
     <Box sx={{mt:"2rem",border:"1px solid gray",padding:'1rem',borderRadius:"0.5rem"}}>
      <Typography variant="h5" sx={{color:"whitesmoke"}}>Content :</Typography>
          <Box sx={{m:"1rem",display:"flex",flexWrap:"wrap",gap:"0.8rem"}}>
             {
              posts?(
                posts.length!=0?(
                 posts.map((singledoc,index)=>
                  <Latest title={singledoc.title} content={singledoc.content} date={singledoc.$createdAt} fileid={singledoc.$id} authorid={singledoc.userid} key={index}/>)
                ):<Box sx={{display:"flex",justifyContent:"center",width:"100dvw",color:"white"}}>Not Posted Yet</Box>
              ):<Box sx={{display:"flex",justifyContent:"center",width:"100dvw"}}> <CircularProgress/></Box>
             }
          </Box>
      </Box>
     </Grid>
   </Container>
  )
}

export default UserAccount;