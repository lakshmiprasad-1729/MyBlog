import { Card ,CardContent,Typography} from '@mui/material'
import {styled} from '@mui/material'


const StyledCard=styled(Card)(()=>({
    display:"grid",
    flexDirection:"column",
    padding:0,
    backdropFilter:'blur(50px)',
    backgroundColor:"transparent",
    outline:'1px solid  rgb(31 41 55)',
    '&:hover':{
      backgroundColor:"transparent",
      cursor:'pointer',
      outline:'2px solid  rgb(107 114 128)',
    }
  }))
  
  const StyledCardContent = styled(CardContent)(()=>({
    display:"flex",
    flexDirection:"column",
    padding:16,
    gap:4,
    flexGrow:1,
    '&:last-child':{
      paddingBottom:16
    }
  }))
  
  const StyledTypography = styled(Typography)(()=>({
    display:'-webkit-box',
    WebkitBoxOrient:'vertical',
    WebkitLineClamp:2,
    overflow:'hidden',
    textOverflow:"ellipsis",
    color:"white"
  }))
  
  export {
    // Author,
    StyledCard,
    StyledCardContent,
    StyledTypography
  }