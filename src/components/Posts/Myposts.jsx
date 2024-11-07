import DatabaseService from "../../appwrite/databaseService.js"
import { useEffect, useState } from 'react';
import { Box, Container,Grid2 as Grid, Typography,Button, Grid2, Alert } from "@mui/material"
import MuiCard from "../Mui/MuiCard.jsx";
import Latest from "../Mui/Latest.jsx";
import PostsLoader from "../LoadingAnimation/PostsLoader.jsx";
import EmptyPosts from "../LoadingAnimation/EmptyPosts.jsx"
import { useNavigate } from "react-router-dom";
import localStorageService from "../../assets/localStorage.js";

export default function Myposts() {
  const navigate = useNavigate();
   const [user,setUser] = useState(false);
   const [dataStatus,setDataStatus] = useState(false)
   const [data,setData] = useState(false);
   const [data1,setData1]= useState([]);//data for main display
   const [data2,setData2]= useState([]);//data for latest
   const [lastId,setLastId] = useState('')
   const [firstId,setFirstId] = useState('')
   const [nextPageStatus,setNextPageStatus] = useState(false);
   const [prevPageStatus,setPrevPageStatus] = useState(false);
   const [error,setError] = useState(false)
  
  useEffect(()=>{

   let data = JSON.parse(localStorageService.getData()).userdata;
    setUser(data);
  },[])
 
  useEffect(()=>{
    setTimeout(()=>{
      setError(false);
    },7000)
  },[error])

  useEffect(()=>{
    
      if (user) {
      ;(async()=>{
        const listdata = await DatabaseService.listUserDocuments(user.$id);
        if(typeof listdata=='object'){
          setData(listdata.documents);
          setDataStatus(true);
        }
      })()
    }
    
  },[user])
  
  useEffect(()=>{
    if(data){
      if(data.length){
        setFirstId(data[0])
        setData1(data.slice(0,4));
        setData2(data.slice(4,10));
        if(data.length==10){
          setLastId(data[9])
        }
       }
    }
   
  },[data])

  useEffect(()=>{
    if(lastId){
     DatabaseService.listUsersNextDocuments(user.$id,lastId.$id)
     .then((data)=>typeof data=='object'?(data.documents.length!=0?setNextPageStatus(true):setNextPageStatus(false)):setNextPageStatus(false))
    }
 
    },[lastId,user])

    useEffect(()=>{
    if(firstId){
      DatabaseService.listUsersPrevDocuments(user.$id,firstId.$id)
      .then((data)=>typeof data=='object'?(data.documents.length!=0?setPrevPageStatus(true):setPrevPageStatus(false)):setPrevPageStatus(false))
    }

   },[firstId,user])

    async function NextPage(){

      try {
        setDataStatus(false);
        let documentData = await DatabaseService.listUsersNextDocuments(user.$id,lastId.$id);
          setData(documentData.documents);
          setDataStatus(true);
          setNextPageStatus(false);
        } catch{
          setError("error while fetching next page details")
      }
    }

    async function PrevPage(){
      try {
        setDataStatus(false);
        let documentData = await DatabaseService.listUsersPrevDocuments(user.$id,firstId.$id);      
          setData(documentData.documents);
          setDataStatus(true);
          setPrevPageStatus(false);
      } catch {
        setError("error while fetching prev page details")
      }
    }

  

  return (
    (user)?(
      (dataStatus)?(
        <Box sx={{width:"100dvw", display:"flex",justifyContent:"center"}}>
        <Typography variant="h6" sx={{marginTop:"8rem",color:"white",display:(data.length?"none":"inline")}}>No results</Typography>
        <Alert variant="filled" sx={{marginTop:"8rem",color:"white",display:(!error?"none":"inline")}}>{error}</Alert>
      <Container component={'main'} maxWidth="lg" sx={{display:(data.length?"flex":"none"),flexDirection:"column"}}>
        {data?(
           <Typography variant="h4" sx={{fontFamily:"monospace",mt:13,color:"whitesmoke",p:3}}>
           Blog  :
         </Typography>
        ):<EmptyPosts/>}
        <Grid container justifyContent={"center"}  spacing={2} columns={12} >
           {data1?(data1.map((data)=>(
             <MuiCard component="mypost" fileid={data.$id} key={data.$id} imageid={data.imageid} title={data.title} content={data.content} date={data.$createdAt} authorid={data.userid}/>
           ))):null
           }
        </Grid>
        <Grid container spacing={2} columns={12} sx={{marginTop:"1rem"}}>
        {
          data2?(data2.map((data)=>(
              <Latest component="mypost" fileid={data.$id} key={data.$id}  title={data.title} content={data.content} date={data.$createdAt} authorid={data.userid}/>
            ))):null
        }
          </Grid>
         <Box sx={{display:"flex",width:"100dvw",justifyContent:"center"}}>
          <Button onClick={()=>PrevPage()} variant="contained" sx={{display:(prevPageStatus?"flex":"none"), fontSize:14,px:"4px", m:"1rem", '&:focus':{outline:"none"},borderRadius:"0.5rem",bgcolor:((prevPageStatus ?"rgb(59 130 246)":'')),textTransform:"capitalize",color:"white",pointerEvents:(prevPageStatus ?"auto":"none")}}>Prev</Button>
          <Button onClick={()=>NextPage()} variant="contained" sx={{display:(nextPageStatus?"flex":"none"), fontSize:14 ,px:"4px",m:"1rem", '&:focus':{outline:"none"},borderRadius:"0.5rem",bgcolor:((nextPageStatus ?"rgb(59 130 246)":'')),textTransform:"capitalize",border:"none",color:"white",pointerEvents:(nextPageStatus ?"auto":"none")}}>Next</Button>
      </Box>
      </Container>
    </Box>
      ):(
        <Box sx={{width:"100dvw",height:"100dvh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"black",margin:0,padding:0,overflow:"hidden"}}>
        <PostsLoader/>
       </Box>
      )
    ):user==null?(
      <Box sx={{width:"100dvw",height:"100dvh",display:"flex",justifyContent:"center",alignItems:"center"}}>
       <Grid2>
       <Button variant="contained" onClick={()=>navigate('/login')}>Login</Button>
       <Button variant="contained" sx={{mx:"1rem"}} onClick={()=>navigate('/register')}>Register</Button>
       </Grid2>
      </Box>
    ):null
  )
}
