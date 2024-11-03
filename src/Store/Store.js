import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice.js'


const Store = configureStore({
    reducer:{
        authentication:authSlice,
    }
})

export default Store;