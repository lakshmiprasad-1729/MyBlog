import {  useEffect, useState } from "react";import DatabaseService from '../../appwrite/databaseService.js'
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import {  Alert, Box, Button, CircularProgress, Container, Grid2, Typography } from "@mui/material";
import EditorLoading from "../LoadingAnimation/EditorLoading.jsx";
import { Controller,useForm } from "react-hook-form";
import InputComponent from '../Mui/Input.jsx'


export default function UpdatePost() {
    const [postDetails,setPostDetails]=useState([])
  const [loadingStatus,setLoadingStatus] = useState(false);
    const [editorStatus,setEditorStatus] = useState(true);
    const [error,setError] = useState(false);
    const {fileId} = useParams();
    const [content,setContent] =useState(false)
    const [title,setTitle] =useState(false)
   
    useEffect(()=>{
        if(fileId){
            DatabaseService.listDocumentByFileId(fileId)
        .then((data)=>setPostDetails(data.documents[0]))
        .catch((error)=>console.log(error))
        }
       },[fileId])
    
  useEffect(()=>{
     if(postDetails.content)
     {
        setContent(postDetails.content)
        setTitle(postDetails.title)
     }
  },[postDetails])

    const navigate = useNavigate();  
   

     const {control,handleSubmit} = useForm((
           { defaultValues:{
                title:`${title?title:""}`,
                content:`${content?content:''}`
              }
            ,
        }
     ))



    const handledata = async(data) => {
      setLoadingStatus(true)
     const imageData=(document.getElementById('imageSource').files[0])?await DatabaseService.uploadFile(document.getElementById('imageSource').files[0]):false;
     imageData?(
        await DatabaseService.deleteFile(postDetails.imageid)
    ):null

    if(data.title=='' && data.content=='' && !imageData){
      setError('there are no change please change something to edit');
      setLoadingStatus(false)
      return null;
    }
    
    console.log()
    if (typeof imageData=='object') {
      if(data.title!='' && data.content!=''){
           const result = await DatabaseService.updatePost({title:data.title,content:data.content,imageid:imageData.$id},postDetails.$id,postDetails.userid)
           result==true?setLoadingStatus(false):setError(result)
           navigate('/my-post')
      }
      if(data.title!='' && data.content==''){
        const result = await DatabaseService.updatePost({title:data.title,imageid:imageData.$id},postDetails.$id,postDetails.userid)
           result==true?setLoadingStatus(false):setError(result)
           navigate('/my-post')
      }
      if(data.title=='' && data.content!=''){
        const result = await DatabaseService.updatePost({content:data.content,imageid:imageData.$id},postDetails.$id,postDetails.userid)
           result==true?setLoadingStatus(false):setError(result)
           navigate('/my-post')
      }
      if(data.title=='' && data.content==''){
        const result = await DatabaseService.updatePost({imageid:imageData.$id},postDetails.$id,postDetails.userid)
           result==true?setLoadingStatus(false):setError(result)
           navigate('/my-post')
      }
     
    }
    else{
      if(data.title!='' && data.content!=''){
        const result = await DatabaseService.updatePost({title:data.title,content:data.content},postDetails.$id,postDetails.userid)
        result==true?setLoadingStatus(false):setError(result)
        navigate('/my-post')
      }
      if(data.title!='' && data.content==''){
        const result = await DatabaseService.updatePost({title:data.title},postDetails.$id,postDetails.userid)
        result==true?setLoadingStatus(false):setError(result)
        navigate('/my-post')
      }
      if(data.title=='' && data.content!=''){
        const result = await DatabaseService.updatePost({content:data.content},postDetails.$id,postDetails.userid)
           result==true?setLoadingStatus(false):setError(result)
           navigate('/my-post')
      }
    }

    setLoadingStatus(false)
    // if(data.title!='' || content!=''){
    //   const result=data.title!=''?(
    //     data.content!=''? await DatabaseService.updatePost({title:data.title,content:String(data.content)},imageData?imageData.$id:false,postDetails.$id,postDetails.userid):
    //     await DatabaseService.updatePost({title:title},imageData?imageData.$id:false,postDetails.$id,postDetails.userid)
    //   ):(
    //     await DatabaseService.updatePost({content:String(data.content)},imageData?imageData.$id:false,postDetails.$id,postDetails.userid)
    //   )
    //   result===true?navigate('/my-post'):setError(result)
    //   setLoadingStatus(false)
    // }
    // else{
    //   setError('title and description shouldn`t be empty')
    //   setLoadingStatus(false);
    // }

    };

    useEffect(()=>{
      setTimeout(()=>setError(false),1000)
    },[])


  return (
  <Container maxWidth="lg" sx={{mt:"8rem",maxWidth:"100dvw",minHeight:"100dvh"}}>
     <Grid2 minWidth={{xs:"20rem",md:"30rem"}}>
    <Alert variant="outlined" sx={{display:(error?"flex":"none"),minwidth:"80dvw"}} severity="error">{error}</Alert>
      <form onSubmit={handleSubmit(handledata)}>

     <Grid2 my={"1rem"}>
      <Typography variant="outlined" sx={{color:"white"}}>Title</Typography>
        <Controller
        name="title"
        control={control}
        render={({field})=>(
          <InputComponent required={false}  field={field} type={"text"} placeholder={title?title:''} />
        )}
        />
     </Grid2>

     <Grid2 my={"1rem"} >
        <Typography variant="outlined" sx={{color:"white"}}>Section</Typography>
        <InputComponent required={false} value={postDetails?postDetails.title:null} type={"text"} placeholder={"space"}/>
       </Grid2>

     <Grid2 my={"1rem"} >
      <Typography variant="outlined"sx={{color:"white"}}>Description :</Typography>
      {
      (editorStatus)?(
       <Controller
       name="content"
       control={control}
       render={({field: {onChange}}) => (
        <Editor
        apiKey={`${import.meta.env.VITE_TINYMCE_API_KEY}`}
        className="bg-black"
        initialValue={`${content?content:''}`}
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
      ):(
        <Box my={"1rem"}><EditorLoading/></Box>
      )
    }
     </Grid2>

   <Grid2 my={"1rem"} container justifyContent={"space-between"}>
     <Grid2>
     <Typography sx={{color:"white"}}>select</Typography>
     <input type="file" name="imagefromuser" id="imageSource"  className=" text-white image-inp" accept=".jpg, .jpeg, .png"   />
     </Grid2>
     <Grid2>
     <CircularProgress sx={{display:(loadingStatus?"inline":"none"),marginRight:"1rem"}}/>
     <Button type="submit"sx={{display:(loadingStatus?"none":"inline"),height:"2.5rem"}} variant="contained">Submit</Button>
     </Grid2>
   </Grid2>

 </form>
 </Grid2>
  </Container>

  )
}
