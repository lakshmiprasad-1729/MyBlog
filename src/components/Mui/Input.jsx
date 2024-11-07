 import { TextField } from "@mui/material"
import PropTypes from "prop-types";

InputComponent.proptypes={
    field:PropTypes.object,
    type:PropTypes.string,
    placeholder:PropTypes.string,
    required:PropTypes.bool,
 }

function InputComponent({field,type='text',placeholder='',required=true}) {

  return (
    <TextField
          {...field}
          type={type}
          autoFocus
          placeholder={placeholder}
          required={required}
          fullWidth
          color="white"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              fontFamily: "Arial",
              fontWeight: "bold",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgb(51 65 85)",
                borderWidth: "2px",
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(59 130 246)",
                  borderWidth: "1px",
                },
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(59 130 246)",
                },
              },
           }}}
        />
  )
}



export default InputComponent