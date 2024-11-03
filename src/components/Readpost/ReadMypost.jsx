import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import DatabaseService from "../../appwrite/databaseService";
import parse from 'html-react-parser'
import PostsLoader from "../LoadingAnimation/PostsLoader";
import { Button, CircularProgress } from "@mui/material";

export default function ReadMyPost() {
    const [postDetails,setPostDetails]= useState(false);
    const [user,setUser] = useState(null);
    const [imageUrl,setImageUrl]=useState(null)
    const [time,setTime]= useState();
    const {fileId} = useParams();
    const [deleteStatus,setDeleteStatus] = useState(false);
    const navigate= useNavigate();
   
   useEffect(()=>{
    if(fileId){
        DatabaseService.listDocumentByFileId(fileId)
    .then((data)=>setPostDetails(data.documents[0]))
    .catch((error)=>console.log(error))
    }
   },[fileId])

    useEffect(()=>{
         if(postDetails){
          setUser(postDetails.ownerName)
          DatabaseService.getFileView(postDetails.imageid)
          .then((data)=>setImageUrl(data.href))
          .catch((error)=>console.log(error))
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

    async function deletePost(){
       try {
        setDeleteStatus(true)
        const result =await DatabaseService.deletePost(postDetails.$id,postDetails.imageid)
        setDeleteStatus(false)
        result===true?navigate('/my-post'):null
       } catch (error) {
        return error.message
       }
    }

  return (
    (postDetails)?(
      <div className="w-[100dvw]  grid justify-center items-center ">
      <div className="bg-transparent mx-[2rem] w-[95dvw] md:w-[70dvw] lg:w-[60dvw] xl:w-[55dvw] 2xl:w-[55dvw]  mt-[7rem] sm:min-h-[80dvh] rounded-xl  sm:mx:[1rem] md:mx-[2rem] border border-gray-700 pb-[2rem] mb-[1rem]">
          <div id="owner-info" className="text-white mt-[0.7rem] ml-[1rem] md:ml-[2.5rem] flex w-full">
            <div className="w-[2rem] h-[2rem] rounded-3xl bg-indigo-600 border border-white text-center mt-[0.25rem]">{user?user.charAt(0).toUpperCase():null}</div>
             {
               user? (
                  <div className="ml-[1rem]">
                      <div>{user}</div>
                      <div className="text-[0.7rem] mr-auto text-neutral-400">posted {time?time:null} {time==='today'?null:"ago"}</div>
                  </div>
              ):null
             }
          </div>
          <div id="w-full post grid ">
              <div id="title" className="w-full flex justify-center text-white text-lg font-semibold font-mono mt-[1rem]">
                  <div className="w-4/5 flex justify-start">
                  {
                      postDetails?postDetails.title:null
                  }
                  </div>
              </div>
              
              <div id="image" className="w-full flex justify-center p-[1rem]">
                {
                  imageUrl?<img className="rounded-lg" src={imageUrl} alt="image loading" />:null
                }    
              </div> 
              <div className="text-neutral-200 text-[0.9rem] md:text-[1.1rem] xl:text-[1.2rem] mt-[1rem] w-full" id="description ">
                <div className="w-full  px-[1rem] text-pretty">
                {
                 postDetails? parse(postDetails.content):null
                }
                </div>
              </div>
          </div>
      </div>
      <div className="flex justify-center mb-[3rem]">
        <div>
        <Button variant="contained" onClick={deletePost} sx={{color:"white",bgcolor:"red",display:(deleteStatus?"none":"flex")}}>Delete</Button>
         <CircularProgress sx={{display:(deleteStatus?"flex":"none")}}/>
        </div>
          <div>
          <Button onClick={()=>navigate(`/read-my-post/edit/${postDetails.$id}`)} variant="contained" sx={{color:"white",marginLeft:"1rem"}}>Edit</Button>
          </div>
        </div>
  </div>
    ):(
     <div className="w-[100dvw] h-[100dvh] flex justify-center items-center">
   <PostsLoader/>
     </div>
    )
  )
}

