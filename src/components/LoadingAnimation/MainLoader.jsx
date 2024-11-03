import Loader from './Loader'
import Loading from './Loading'
import { Box } from '@mui/material'

function MainLoader() {
  return (
    <Box sx={{width:"100dvw",height:"100dvh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"black",margin:0,padding:0,overflow:"hidden"}}>
        <Loader/>
        <Loading/>
    </Box>
  )
}

export default MainLoader