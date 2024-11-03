import { Container,Box,Button, Typography } from "@mui/material"
import emptyPost from '../Icon/posts.jpg'
import { useNavigate } from "react-router-dom"
function EmptyPosts() {
  const navigate=useNavigate();
  return (
   <Container maxWidth="lg" sx={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"7rem"}}>
     <Box>
     <img src={emptyPost} alt="image Loading" />
     </Box>
     <Box sx={{margin:"1rem"}}>
     <Typography variant="body1" sx={{color:"white"}}>you haven't posted</Typography>
      <Button onClick={()=>navigate('/add-post')} variant="contained">Add post </Button>
     </Box>
    </Container>
  )
}

export default EmptyPosts