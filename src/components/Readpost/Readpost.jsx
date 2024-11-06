import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import DatabaseService from "../../appwrite/databaseService";
import parse from 'html-react-parser'
import PostsLoader from "../LoadingAnimation/PostsLoader";
import { Box, Divider, IconButton, Typography ,Alert, Collapse, Container, Button, CircularProgress} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import AppwriteLikes from "../../appwrite/appwriteLike";
import localStorageService from "../../assets/localStorage";
import Comment from "../Mui/Comment";
import { StyledTypography } from "../Mui/MuiCustom";
import InputComponent from "../Mui/Input"
import AppwriteComments from "../../appwrite/appwriteComment"
import AppwriteSubscribe from "../../appwrite/appwriteSubscribe";

export default function Readpost() {
  const navigate = useNavigate();
    const [postDetails,setPostDetails]= useState(false); //set posts details
    const [likes,setLikes]=useState(false); //like details
    const [currentUser,setcurrentUser] = useState(null); //current userdetails
    const [imageUrl,setImageUrl]=useState(null); //imageurl manage
    const [time,setTime]= useState();   //helps in timelogic
    const {fileId} = useParams();
    const [pointer,setPointer] = useState(false); //helps in create or delete likes
    const [error,setError] = useState(false);
    const [expanded,setExpanded] = useState(false)
    const [comment,setComment] = useState(false);
    const [commentList,setCommentList] = useState(false);
    const [addCommentStatus,setAddCommentStatus] = useState(false);
    const [subscribe,setSubscribe] = useState(false);
    const [subscribeStatus,setSubscribeStatus] = useState(true);

    
    useEffect(()=>{
      if(fileId){
        DatabaseService.listDocumentByFileId(fileId)
        .then((data)=>(data.documents?data.documents.length!=0:false)?setPostDetails(data.documents[0]):null)
        .catch((error)=>console.log(error))
      }
    },[fileId])

    useEffect(()=>{
      
      let data = JSON.parse( localStorageService.getData());
      setcurrentUser(data.userdata); 
      
     
    },[])
    
    useEffect(()=>{
         if(postDetails){
          DatabaseService.getFileView(postDetails.imageid)
          .then((data)=>setImageUrl(data.href))
          .catch((error)=>setError(error))


        let postdate = new Date(postDetails.$createdAt.split("T")[0])
        let presentDate = new Date()
          
          if(presentDate.getFullYear()-postdate.getFullYear()!=0){
            setTime(presentDate.getFullYear()-postdate.getFullYear()+" years")
          }
          else{
            if(presentDate.getMonth()-postdate.getMonth()!=0){
                setTime(presentDate.getMonth()-postdate.getMonth()+" months")
            }
            else{
                if(presentDate.getDate()-postdate.getDate()!=0){
                    setTime(presentDate.getDate()-postdate.getDate()+" days")
                }
                else{
                    setTime("today")
                }
            }
          }
         }


    },[postDetails])

    useEffect(()=>{
      currentUser && postDetails?(
        AppwriteSubscribe.checkSubscribe(postDetails.userid,currentUser.$id)
        .then(res=>typeof res==='object'?(res.documents.length!==0?setSubscribe(res.documents[0]):null):null)
        .catch(err=>setError(err))
      ):null

      setSubscribeStatus(false);

       
      setCommentList(postDetails.comments);
           
      if(postDetails && currentUser){
       if(postDetails.likes.length!==0){
        AppwriteLikes.getLikeDetails(postDetails.$id,currentUser.$id)
        .then(docdata=>setLikes(docdata.documents.length!==0?
          {num:postDetails.likes.length,liked:docdata.documents[0]}
          :{num:postDetails.likes.length,liked:false}))
        .catch(error=>console.log(error))
       }
      }
    else{
      setLikes(false)
    }

    },[postDetails,currentUser])


    async function toggleLike(){
      setPointer(true);
      if(likes.liked){
        await AppwriteLikes.removeLike(likes.liked.$id)===true?
        setLikes({num:likes.num-1,liked:false}):
        setError('error at removing like either due to network or incorrect request');
        setPointer(false);
      }
      else{
        if(currentUser && postDetails)
        {
             const newlike = await AppwriteLikes.Like(postDetails.$id,currentUser.$id)
             const likeddata = await DatabaseService.updateRelation(postDetails,newlike.$id);
             typeof likeddata==='object'?setLikes({num:likeddata.likes.length,liked:newlike}):setError(likeddata)
             setPointer(false);
        }
      }
    }

    async function addComment(){
      setAddCommentStatus(true)
      if(comment && comment!==''){
        const newComment= await AppwriteComments.createComment(postDetails.$id,currentUser.$id,comment,currentUser.name);
        const  commenteddata = await DatabaseService.updateCommentRelation(postDetails,newComment.$id);
        typeof commenteddata ==='object'?setCommentList(commenteddata.comments):setError(commenteddata);
        setAddCommentStatus(false)
        setComment(false)
      }
      else{
        setError('empty comment shouldn`t be commented')
        setAddCommentStatus(false)

      }
      
    }

    useEffect(()=>{
      error?null:
      setTimeout(()=>setError(false),7000)
    },[error])


   
    async function Subscribe(){
      setSubscribeStatus(true);
      if(currentUser){
        const result = await AppwriteSubscribe.Subscribe(postDetails.userid,currentUser.$id,postDetails.ownerName);
        typeof result==='object'?setSubscribe(result):setError(result);
        setSubscribeStatus(false);
      }
      else{
        setError("please login or register to subscribe")
        setSubscribeStatus(false);
      }
    }
    
    async function unSubscribe(){
      setSubscribeStatus(true);
      if(typeof subscribe === 'object'){
         const result = await AppwriteSubscribe.unSubscribe(subscribe.$id);
         result===true?setSubscribe(false):setError(result);
         setSubscribeStatus(false);
      }
      else{
        setError('Invalid user')
        setSubscribeStatus(false);
      }
    }


  return (
    (postDetails)?(
      <div className="w-[100dvw]  grid justify-center items-center ">
      <div className="bg-transparent mx-[2rem] w-[95dvw] md:w-[70dvw] lg:w-[60dvw] xl:w-[55dvw] 2xl:w-[55dvw]  mt-[7rem] sm:min-h-[80dvh] rounded-xl  sm:mx:[1rem] md:mx-[2rem] border border-gray-700 mb-[1rem]">
       {
             error?<Alert variant="outlined" severity="error" >{error}</Alert>:null

       }
      <div id="owner-info" onClick={()=>navigate(`/view-account/${postDetails.userid}`)} className="text-white mt-[0.7rem] ml-[1rem] md:ml-[2.5rem] flex justify-between ">
            <div className="flex">
            <div className="w-[2rem] h-[2rem] rounded-3xl bg-indigo-600 border border-white text-center mt-[0.25rem]">{postDetails?postDetails.ownerName.charAt(0).toUpperCase():null}</div>
             {
               postDetails ? (
                  <div className="ml-[1rem]">
                      <div>{postDetails.ownerName}</div>
                      <div className="text-[0.7rem] mr-auto text-neutral-400">posted {time?time:null} {time==='today'?null:"ago"}</div>
                  </div>
              ):null
             }
            </div>
             {
              subscribeStatus?<CircularProgress mr="1.5rem"/>:(
                <Box>
                  <Button 
                onClick={Subscribe}
                sx={{color:"white",height:"2rem",mr:"1rem",textTransform:"capitalize",display:(subscribe?'none':'flex')}} variant="contained">
                   Follow
                </Button>
                <Button 
                onClick={unSubscribe}
                sx={{color:"white",height:"2rem",mr:"1rem",textTransform:"capitalize",display:(subscribe?'flex':'none')}} variant="contained">
                   unFollow
                </Button>
                </Box>
              )
             }
          </div>
          <div id="w-full post grid ">
              <div id="title" className="w-full flex justify-center text-white text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem]  font-semibold mt-[1rem]">
                  <div className="w-4/5 flex justify-start">
                 <Typography variant="inherit">
                 {
                      postDetails?postDetails.title:null
                  }
                 </Typography>
                  </div>
              </div>
              
              <div id="image" className="w-full flex justify-center p-[1rem]">
                {
                  imageUrl?<img className="rounded-lg" src={imageUrl} alt="image loading" />:null
                }    
              </div> 
              <div className="text-neutral-200 text-[0.9rem] md:text-[1.1rem] xl:text-[1.2rem] mt-[1rem] w-full" id="description ">
                <div className="w-full  px-[1rem] text-pretty">
                {postDetails?parse(postDetails.content):null}
                </div>
              </div>
          </div>
          <Divider sx={{my:"0.5rem",bgcolor:"#374151"}}/>
          <Box  sx={{mb:"1rem",display:"flex"}}>
              <Box sx={{display:"flex"}}>
              <Typography variant="subtitle1" pt="0.5rem" ml={"1rem"} color="white">{likes?likes.num:''}</Typography>
              <IconButton sx={{mr:"0.5rem"}} onClick={toggleLike} disabled={pointer}>
               <ThumbUpIcon sx={{color:(likes?likes.liked?"blue":"whitesmoke":"whitesmoke"),}} />
              </IconButton>
              </Box>
              <Box sx={{display:"flex"}}>
              <Typography variant="subtitle1" p={"0.35rem"} color="white">comments:</Typography>
                <IconButton sx={{color:"whitesmoke"}} onClick={()=>setExpanded(prev=>!prev)} aria-label="">
                  <CommentIcon/>
                </IconButton>
              </Box>
          </Box>
      </div>
     <Container maxWidth="lg" >
       <Collapse sx={{p:"0.7rem",mx:"1rem",my:'2rem',border:'1px solid purple',borderRadius:'0.5rem'}} in={expanded} timeout="auto" unmountOnExit>
          <Box>
          <StyledTypography variant="h5" sx={{color:"white"}}>add comment :</StyledTypography>
          <Box sx={{display:"flex"}}>
          <InputComponent type={"text"} placeholder={"add comment"} field={{onChange:(e)=>setComment(e.target.value),value:comment?comment:""}}/>
           {!addCommentStatus?<Button variant="contained" onClick={addComment}>add</Button>:<CircularProgress/>}
          </Box>
          </Box>
         <StyledTypography variant="h5" sx={{color:"white"}}> comments :</StyledTypography>
          {
            commentList && commentList.length!==0?(
              commentList.map((eachcomment,index)=>(
                <Comment commentDetails={eachcomment} key={index}/>
              ))
            ): <StyledTypography variant="h6" sx={{color:"white",mt:"0.5rem",textAlign:"center"}}>0 comments</StyledTypography>

          }
       </Collapse> 
     </Container>
  </div>
    ):(
     <div className="w-[100dvw] h-[100dvh] flex justify-center items-center">
   <PostsLoader/>
     </div>
    )
  )
}

