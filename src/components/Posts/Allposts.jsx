import DatabaseService from "../../appwrite/databaseService.js"
import { useEffect, useState } from 'react';
import { Box, Container,Grid2 as Grid, Typography,Button } from "@mui/material"
import MuiCard from "../Mui/MuiCard.jsx";
import Latest from "../Mui/Latest.jsx";
import PostsLoader from "../LoadingAnimation/PostsLoader.jsx";

export default function Allposts() {
  const [data,setData] = useState([])
  const [dataStatus,setDataStatus] = useState(false)
  const [data1,setData1]= useState([]);//data for main display
  const [data2,setData2]= useState([]);//data for latest
  const [lastId,setLastId] = useState(false)
  const [firstId,setFirstId] = useState(false)
  const [nextPageStatus,setNextPageStatus] = useState(false);
  const [prevPageStatus,setPrevPageStatus] = useState(false);
const [error,setError] = useState(false)




  useEffect(()=>{
    ;(async()=>{
      let documentData = await DatabaseService.listDocuments();
      if(typeof documentData=='object'){
        setData(documentData.documents);
      }
      else{
          setError("error while fetching data check internet connectivity");
      }
      setDataStatus(true);
    })()

  },[])


  useEffect(()=>{
    if(data?data.length:false){
     setFirstId(data[0])
     setData1(data.slice(0,4));
     setData2(data.slice(4,10));
     setDataStatus(true)

     if(data.length==10)
      {
      setLastId(data[9]);
     }
     else
     setLastId(false)
    }
    else{
      setFirstId(false)
    }
    
   
  },[data])

  useEffect(()=>{
    if(lastId){
     DatabaseService.listDocumentsNext(lastId.$id)
     .then((data)=>typeof data=='object'?(data.documents.length!=0?setNextPageStatus(true):setNextPageStatus(false)):setNextPageStatus(false))
    }
    },[lastId])

    useEffect(()=>{
    if(firstId){
      DatabaseService.listDocumentsPrev(firstId.$id)
      .then((data)=>typeof data=='object'?(data.documents.length!=0?setPrevPageStatus(true):setPrevPageStatus(false)):setPrevPageStatus(false))
    }
   },[firstId])

    async function NextPage(){
      
      try {
        setDataStatus(false);
        let documentData = await DatabaseService.listDocumentsNext(lastId.$id);
          setData(documentData.documents);
          setDataStatus(true)
          setNextPageStatus(false)
        } catch {
         setError("error while fetching next page details")
      }
    }

    async function PrevPage(){
      try {
        setDataStatus(false)
        let documentData = await DatabaseService.listDocumentsPrev(firstId.$id);      
          setData(documentData.documents);
          setDataStatus(true)
         setPrevPageStatus(false)
      } catch  {
        setError("error while fetching next page details")
      }
    }

  

  return ((dataStatus?(
    <Box sx={{width:"100dvw", display:"flex",justifyContent:"center"}}>
    <Container component={'main'} maxWidth="lg" sx={{display:"flex",flexDirection:"column"}}>
      <Typography variant="h4" sx={{fontFamily:"monospace",mt:13,color:"whitesmoke",p:3}}>
        Blog  :
      </Typography>
      <Grid container justifyContent={"center"}  spacing={2} columns={12} >
         {data1?(data1.map((data)=>(
           <MuiCard fileid={data.$id} key={data.$id} imageid={data.imageid} title={data.title} content={data.content} date={data.$createdAt} authorid={data.userid}/>
         ))):null
         }
      </Grid>
      <Typography variant="h5" sx={{fontFamily:"monospace",mt:2,color:"whitesmoke",p:1,display:(data2.length?"inline":"none")}}>
      Latest :
      </Typography>
      <Grid container spacing={2} columns={12} >
      {
        data2?(data2.map((data)=>(
            <Latest fileid={data.$id} key={data.$id}  title={data.title} content={data.content} date={data.$createdAt} authorid={data.userid}/>
          ))):null
      }
        </Grid>
       <Box sx={{display:{md:"flex"},margin:"1rem",justifyContent:"center",}}>
        <Button onClick={()=>PrevPage()} variant="contained" sx={{fontSize:14,display:(prevPageStatus?"flex":"none"), '&:focus':{outline:"none"},borderRadius:"0.5rem",bgcolor:((prevPageStatus?"rgb(59 130 246)":"")),textTransform:"capitalize",color:"white",pointerEvents:(prevPageStatus?"auto":"none")}}>Prev</Button>
        <Button onClick={()=>NextPage()} variant="contained" sx={{fontSize:14,display:(nextPageStatus?"flex":"none"), mx:"1rem", '&:focus':{outline:"none"},borderRadius:"0.5rem",bgcolor:((nextPageStatus ?"rgb(59 130 246)":"")),textTransform:"capitalize",border:"none",color:"white",pointerEvents:(nextPageStatus?"auto":"none")}}>Next</Button>
    </Box>
    </Container>
  </Box>
  ):(
    <Box sx={{width:"100dvw",height:"100dvh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"black",margin:0,padding:0,overflow:"hidden"}}>
     <PostsLoader/>
    </Box>
  )))
}
