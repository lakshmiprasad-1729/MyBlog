import { Avatar } from "@mui/joy";
import { StyledTypography,StyledCard } from "./MuiCustom";
import PropTypes from "prop-types";
import { Box, Button, CircularProgress, IconButton} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from "react";
import InputComponent from "./Input";
import AppwriteComments from "../../appwrite/appwriteComment";
import localStorageService from "../../assets/localStorage";

export default function Comment({commentDetails}){
    const [inputStatus,setInputStatus] = useState(false);
    const [comment,setComment] = useState(false);
    const [editedComment,setEditedComment] = useState('');
    const navigate = useNavigate();
    const [status,setStatus]=useState(null)
    const [deleteStatus,setDeleteStatus] = useState(false);
    const [editStatus,setEditStatus] = useState(false);


    async function editComment(){
        setEditStatus(true);
        const status = await AppwriteComments.editComment(commentDetails.$id,editedComment);
       status===true?setComment(editedComment):null;
       setInputStatus(false);
       setEditStatus(false)
    }
    
    useEffect(()=>{
    setComment(commentDetails?commentDetails.comment:null)
    setEditedComment(commentDetails?commentDetails.comment:null)
    const user = JSON.parse(localStorageService.getData()).userdata;
    commentDetails?(user.$id===commentDetails.commentedUser?setStatus(true):false):false

    },[commentDetails])

    async function deleteComment(){
        setDeleteStatus(true)
      const result = await AppwriteComments.deleteComment(commentDetails.$id);
        result===true?setDeleteStatus('delete'):setDeleteStatus(false);
    }

    return deleteStatus!=='delete'?(
        <StyledCard sx={{py:"0.5rem",px:"1rem",my:'0.5rem'}}>
        <Box display={"flex"} justifyContent={"space-between"}>
        <Box sx={{display:"flex"}}>
        <Avatar  onClick={()=>navigate(`/user-account/${commentDetails.commentedUser}`)} sx={{bgcolor:'gray',color:"white",width:"2rem",height:"2rem"}}>{commentDetails?commentDetails.userName.charAt(0):''}</Avatar>
        <StyledTypography variant="body1" sx={{py:'3px',px:'0.5rem',color:"white",textTransform:"capitalize",fontSize:'0.9rem'}}>{commentDetails?commentDetails.userName:''}</StyledTypography>
       </Box>
       <Box display={(status?"flex":"none")}>
       <IconButton sx={{'&:hover':{bgcolor:"rgb(31 41 55)"}}} onClick={()=>setInputStatus(prev=>!prev)}>
            <EditOutlinedIcon  sx={{color:'lightblue'}}/>
        </IconButton>
       {
        deleteStatus===true?<CircularProgress/>:(
            <IconButton p="0.5rem" sx={{'&:hover':{bgcolor:"rgb(31 41 55)"}}} onClick={deleteComment}>
            <DeleteOutlineOutlinedIcon sx={{color:"red"}}/>
        </IconButton>
        )
       }
       </Box>
        </Box>
        {
            !inputStatus?<StyledTypography variant="caption" sx={{mt:'0.5rem',color:"white"}}>{comment}</StyledTypography>:
              <Box display={"flex"}>
                <InputComponent type={"text"} field={{onChange:(e)=>setEditedComment(e.target.value),value:editedComment}}/>
                {editStatus?<CircularProgress/>: <Button onClick={editComment} variant="outlined">edit</Button>}
              </Box>
        }
    </StyledCard>
       )
    :null
}
Comment.proptypes={
    commentDetails:PropTypes.object,
 
}