import { errorCatch } from "@/app/api/api.helper";
import { removeFromStorage } from "@/app/services/auth/auth.helper";
import { AuthService } from "@/app/services/auth/auth.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { IAuthResponse, IEmailPassword } from "./user.interface";

/* register */
export const register = createAsyncThunk<IAuthResponse, IEmailPassword>(
    'auth/register',
    async (data, thunkApi) => {
      try {
        const response = await AuthService.main('register', data)
        toast.success('Регистрация прошла успешно');
        return response
      } catch (error) {
        return thunkApi.rejectWithValue(errorCatch(error) || 'Не удалось зарегистрироваться')
      }
    }
  )
  
/* login */
export const login = createAsyncThunk<IAuthResponse, IEmailPassword>(
    'auth/login',
    async (data, thunkApi) => {
      try {
        const response = await AuthService.main('login', data)
        toast.success('Вы вошли в аккаунт');
        return response
      } catch (error) {
        return thunkApi.rejectWithValue(errorCatch(error) || 'Не удалось войти')
      }
    }
  )


export const logout = createAsyncThunk('auth/logout', async () => {
    removeFromStorage()
    toast.success('Вы успешно вышли из аккаунта')
})

/* checkAuth */
export const checkAuth = createAsyncThunk(
    'auth/check-auth',
    async (_, thunkApi) => {
      try {
        const response = await AuthService.getNewTokens()
        return response.data
      } catch (error) {
        if (errorCatch(error) === 'jwt expired') {
          thunkApi.dispatch(logout())
        }
        return thunkApi.rejectWithValue(error)
      }
    }
  )
