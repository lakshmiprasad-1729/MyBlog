// import React from 'react'

import { Box } from "@mui/material";

export default function Container({children}) {
  return (
    
   <Box sx={{maxWidth:"100dvw", minHeight:"100dvh",bgcolor:"black",display:"flex",justifyContent:"center"}}>
    {children}
   </Box>
  )
}

