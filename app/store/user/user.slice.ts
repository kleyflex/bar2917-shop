import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuth, login, logout, register } from "./user.actions";
import { IInitialState, IUserState } from "./user.interface";


// Пользователь из localStorage восстанавливается после гидрации (restoreUser в AuthProvider):
// сервер его не знает, и чтение при старте давало разную разметку на сервере и клиенте
const initialState: IInitialState = {
    user: null,
    isLoading: false,
    isInitialized: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      restoreUser: (state, { payload }: PayloadAction<IUserState | null>) => {
        state.user = payload
        state.isInitialized = true
      }
    },
    extraReducers: builder => {
      builder.addCase(register.pending, state => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.user = payload.user
      })
      .addCase(register.rejected, state => {
        state.isLoading = false
        state.user = null
      })
      .addCase(login.pending, state => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.user = payload.user
      })
      .addCase(login.rejected, state => {
        state.isLoading = false
        state.user = null
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.user = null
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.user = payload.user
      })
    }
  })

export const { restoreUser } = userSlice.actions
