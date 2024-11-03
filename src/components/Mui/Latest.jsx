import {StyledCard,StyledCardContent,StyledTypography} from './MuiCustom.js'
import {Box,Avatar,Typography} from '@mui/material'
import { deepOrange } from '@mui/material/colors'
import Grid from '@mui/material/Grid2'
import PropTypes from 'prop-types'
import Parse from 'html-react-parser'
import { useNavigate } from 'react-router-dom'


export default function Latest({title,content,date,fileid,component="allposts"}){//add authorid
    const navigate = useNavigate();
    return (
        <Grid size={{xs:11,md:6}}>
        <StyledCard variant='outlined '         onClick={()=> component=="allposts"?navigate(`/read-post/${fileid}`):navigate(`/read-my-post/${fileid}`)}>
             <StyledCardContent>
                 <StyledTypography variant='h6' gutterBottom>{title}</StyledTypography>
                 <Box sx={{color:"white",overflow:"hidden",display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:2,    textOverflow:"ellipsis"}}>
                   {Parse(content)}
                 </Box>
             </StyledCardContent>

             <Box sx={{display:'flex' ,justifyContent:'space-between',p:1 }}>
  
           <Box sx={{display:'flex', alignItems:"center"}}>
           <Avatar
            sx={{bgcolor:deepOrange[500]}}>
            {"FB"}
           </Avatar>
              <Typography sx={{pl:2}} variant="caption" color="initial">{''}</Typography>
           </Box>
         
         
           <Box sx={{display:"flex",alignItems:"center"}}>
            <Typography variant="caption" color="white">{new Date(date).toLocaleDateString()}</Typography>
           </Box>
         
         </Box>
           
          </StyledCard>
        </Grid>
    )
}

Latest.propTypes={
    title:PropTypes.string,
    content:PropTypes.string,
    date:PropTypes.string,
    fileid:PropTypes.string,
    component:PropTypes.string,
}