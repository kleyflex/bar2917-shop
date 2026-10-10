import { IUser } from "@/app/types/user.interface"

export interface IUserState {
    email: string
    isAdmin: boolean
}

export interface ITokens {
    accessToken: string
    refreshToken: string
}

export interface IInitialState {
    user: IUserState | null
    isLoading: boolean
    // false до восстановления пользователя из localStorage — до этого нельзя решать про редиректы
    isInitialized: boolean
}

export interface IEmailPassword {
    email: string
    password: string
}

// Ошибка входа/регистрации: статус нужен форме, чтобы привязать ошибку к полю
export interface IAuthError {
    status: number | null
    message: string
}

export interface IAuthResponse extends ITokens {
    user: IUser
}