import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import axiosInstance from "../axiosInstance";

//add item to cart

export const addToCart = createAsyncThunk('cart/add', async(product_id, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.post('/api/v1/user/cart/additem', { product_id }, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//remove item from cart

export const removeFromCart = createAsyncThunk('cart/remove', async(product_id, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.post('/api/v1/user/cart/removeitem', { product_id }, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//delete the item completely from cart

export const deleteItem = createAsyncThunk('cart/delete', async(product_id, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.post('/api/v1/user/cart/delete', { product_id }, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//clear cart items

export const clearCart = createAsyncThunk('cart/clear', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.post('/api/v1/user/cart/clear')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//load cart items

export const loadCart = createAsyncThunk('cart/load', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/user/cart/getitems')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//validate cart items

export const validateCart = createAsyncThunk("cart/validate", async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.post("/api/v1/user/cart/validate")

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//update cart items stock -- real time

export const updateCartStock = createAsyncThunk("cart/update-stock", async(updates, thunkAPI) => {
    return updates
})