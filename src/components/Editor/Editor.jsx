import {  useEffect, useState } from "react";
import DatabaseService from '../../appwrite/databaseService.js'
import { useNavigate } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import {  Alert, Box, Button, CircularProgress, Container, Grid2, Typography } from "@mui/material";
import EditorLoading from "../LoadingAnimation/EditorLoading.jsx";
import AuthService from "../../appwrite/authService.js";
import { Controller,useForm } from "react-hook-form";
import InputComponent from '../Mui/Input.jsx'



export default function TinyEditor() {
  const [loadingStatus,setLoadingStatus] = useState(false);
    const [editorStatus,setEditorStatus] = useState(false);
    const [error,setError] = useState(false);
    const [user,setUser]= useState(false);
    const navigate = useNavigate();    
    const {control,handleSubmit} = useForm(({
      defaultValues:{
        title:'',
        content:'',
      }
    }))

    const handledata = async(data) => {
      setLoadingStatus(true)
      const imageData=(document.getElementById('imageSource').files[0])?await DatabaseService.uploadFile(document.getElementById('imageSource').files[0]):false;
     const user= await AuthService.getCurrentUser();
     if(imageData  && user){
        const result= await DatabaseService.createFile(data.title,String(data.content),user.$id,imageData?imageData.$id:'',user.name);
        result.active?navigate('/'):setError(result.msg)
     }
     setLoadingStatus(false)
     setError("eroror at uploading file check internet connectivity ,file is required")
    };

    useEffect(()=>{
      setTimeout(()=>setEditorStatus(true),5000)
        ;(async()=>{
           AuthService.getUserStatus()
           .then(data=>data==true?setUser(true):setUser(false))
        })()
    },[])


  return (
  (user)?(
    <Container maxWidth="lg" sx={{mt:"8rem",maxWidth:"100dvw",minHeight:"100dvh"}}>
    <Grid2 minWidth={{xs:"20rem",md:"30rem"}}>
   <Alert variant="outlined" sx={{display:(error?"flex":"none"),fontWeight:"900",minwidth:"80dvw"}} severity="error">{error}</Alert>
     <form onSubmit={handleSubmit(handledata)}>

    <Grid2 my={"1rem"}>
     <Typography variant="outlined" sx={{color:"white"}}>Title</Typography>
     <Controller
     name="title"
     control={control}
     render={({field})=>(
       <InputComponent field={field} type={"text"} placeholder={"Blockchain Beyond Crypto: Transforming Industries and Enhancing Security in 2024"} />
     )}
     />
    </Grid2>

    <Grid2 my={"1rem"} >
       <Typography variant="outlined" sx={{color:"white"}}>Section</Typography>
       <InputComponent type={"text"} placeholder={"space"}/>
      </Grid2>

    <Grid2 my={"1rem"} >
     <Typography variant="outlined"sx={{color:"white"}}>Description :</Typography>
     {
      <Controller
      name="content"
      control={control}
      render={({field: {onChange}}) => (
       <Editor
       apiKey={`${import.meta.env.VITE_TINYMCE_API_KEY}`}
       className="bg-black"
       initialValue=""
       skin='oxide-dark'
       cloudChannel="7-dev"
       init={{
         setup:()=>setEditorStatus(true),
         license_key: 'gpl',
         selector:"textarea",
         content_css:'Editor.css',
         color_default_background:"black",
         menubar: true,
         plugins: [
           "image",
           "advlist",
           "autolink",
           "lists",
           "link",
           "image",
           "charmap",
           "preview",
           "anchor",
           "searchreplace",
           "visualblocks",
           "code",
           "fullscreen",
           "insertdatetime",
           "media",
           "table",
           "code",
           "help",
           "wordcount",
           "anchor",
       ],
       toolbar:
       "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
       content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px ,background-color:red}"
     
       }}
       onEditorChange={onChange}
       />
      )}
   />
  }
  <Box sx={{display:(editorStatus?"none":'flex')}} my={"1rem"}><EditorLoading/></Box>
    </Grid2>

  <Grid2 my={"1rem"} container justifyContent={"space-between"}>
    <Grid2>
    <Typography sx={{color:"white",marginTop:"2rem"}}>select</Typography>
    <input type="file" name="imagefromuser" id="imageSource"  className=" text-white image-inp" accept=".jpg, .jpeg, .png"   />
    </Grid2>
    <Grid2 container justifyContent={"center"} sx={{marginTop:"2rem"}}>
    <CircularProgress sx={{display:(loadingStatus?"inline":"none"),marginRight:"1rem"}}/>
    <Button type="submit" sx={{display:(loadingStatus?"none":"flex")}} variant="contained">Submit</Button>
    </Grid2>
  </Grid2>

</form>
</Grid2>
 </Container>
  ):(
    <Box sx={{width:"100dvw",height:"100dvh",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <Grid2 >
    <Button variant="contained" onClick={()=>navigate('/login')}>Login</Button>
    <Button variant="contained" onClick={()=>navigate('/register')}>Register</Button>
    </Grid2>
   </Box>
  )

  )
}
