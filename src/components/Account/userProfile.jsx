import { useEffect, useState } from "react";
import AppwriteProfiles from "../../appwrite/appwriteProfiles";
import { Avatar, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";


function stringToColor(string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }      
    return color;
  }
  

function UserProfile({doc,handleLogin}) {
    const [name,setName] = useState(false);
    useEffect(()=>{
      if(doc){
        AppwriteProfiles.getDocument(doc.owner)
      .then(data=>data?data.documents?(setName(data.documents[0].name)):'':'')
      }
    },[])
   
    return (
      <Button display={"grid"} onClick={handleLogin}>
      <Avatar sx={{bgcolor:(()=>stringToColor(name)),width:"3rem",height:"3rem",color:"white"}}>{name?name.charAt(0):''}</Avatar>
      <Typography variant="caption" sx={{color:'white',textTransform:'capitalize',textAlign:"center",p:"0.25rem"}}>{name?name:''}</Typography>
    </Button>
  
    )
}



UserProfile.proptypes={
    doc :PropTypes.object,
    handleLogin:PropTypes.func,
    owner:PropTypes.string
  }


  export default UserProfile;

  