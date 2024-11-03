import { createSlice } from "@reduxjs/toolkit";

const initialState={
    status:false,
    userdata:null
}

const authSlice = createSlice({
    name:'authentication',
    initialState,
    reducers:{
        authLogin:(state,action)=>{
            state.status=true,
            // console.log(action.payload,"auth")
            state.userdata=action.payload;
        },
        authLogout:(state)=>{
             state.status=false,
             state.userdata=null
        }
    }
})

export const {authLogin,authLogout } = authSlice.actions;
export default authSlice.reducer