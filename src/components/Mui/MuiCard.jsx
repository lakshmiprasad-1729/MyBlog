import { Grid2 as Grid ,CardMedia ,Divider,Box ,Avatar,Typography, IconButton} from '@mui/material'
import {StyledCard,StyledCardContent,StyledTypography } from './MuiCustom.js'
import PropTypes from 'prop-types'
import DatabaseService from '../../appwrite/databaseService.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import parse from 'html-react-parser'
import AppwriteProfiles from '../../appwrite/appwriteProfiles.js'
export default function MuiCard({imageid,title,content,date,authorid,fileid,component="allposts"}){
    const [imageurl,setImageurl] = useState('');
    const [author,setAuthor]=useState(false);
     const  changedDateFormat = new Date(date).toLocaleDateString();
    const navigate= useNavigate();

    useEffect(()=>{
      DatabaseService.getFilePreview(imageid)
      .then((imagedata)=> setImageurl(imagedata.href))

      AppwriteProfiles.getDocument(authorid)
      .then(data=>setAuthor(data.documents[0]))
    },[])

 
    return (
        <Grid size={{xs:11,md:6}}>
        <StyledCard
        //  sx={{
        //    width:"300px",
        //    '&.hover':{
        //     width:"310px"
        //    }
        //  }}
        variant='outlined'
        onClick={()=> component=="allposts"?navigate(`/read-post/${fileid}`):navigate(`/read-my-post/${fileid}`)}
        >
        <CardMedia 
        component="img"
        alt='image loading'
        image={imageurl}
        sx={{
          borderBottom:'1px solid',
          borderColor:'divider',
            aspectRatio:'16/9',
        }}
        />
        <Divider sx={{bgcolor:"rgb(31 41 55)"}}/>
        <StyledCardContent sx={{height:{lg:"10rem"}}}>
          <StyledTypography variant='h6' gutterBottom>{title}</StyledTypography>
          <Box  sx={{color:"white",overflow:"hidden",display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:3,    textOverflow:"ellipsis"}}>
            {parse(content)}
          </Box>
        </StyledCardContent>
        

        <Box sx={{display:'flex' ,justifyContent:'space-between',p:1 }}>
  
           <Box sx={{display:'flex', alignItems:"center"}}>
           <Avatar
            sx={{bgcolor:"rgb(55 65 81)"}}>
            {author?author.name.charAt(0):''}
           </Avatar>
              <Typography sx={{pl:2}} variant="caption" color="white">{author?author.name:''}</Typography>
              <IconButton aria-label="" >
              </IconButton>
           </Box>
         
         
           <Box sx={{display:"flex",alignItems:"center"}}>
            <Typography variant="caption" sx={{color:"white"}}>{changedDateFormat}</Typography>
           </Box>
         
         </Box>

        </StyledCard>
     </Grid>
    )
}

MuiCard.propTypes={
    imageid:PropTypes.string,
    title:PropTypes.string,
    content:PropTypes.string,
    authorid:PropTypes.string,
    date:PropTypes.string,
    fileid:PropTypes.string,
    component:PropTypes.string,

}

