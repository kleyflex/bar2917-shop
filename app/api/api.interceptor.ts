import axios from "axios";
import { getAccessToken, removeFromStorage } from "../services/auth/auth.helper";
import { AuthService } from "../services/auth/auth.service";
import { getContentType } from "./api.helper";

const API_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const instance = axios.create({
    baseURL: API_SERVER_URL,
    headers: getContentType()
})

instance.interceptors.request.use(config => {
    const accessToken = getAccessToken()

    if(config && config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})

// Первый 401 запускает обновление, остальные ждут тот же промис
let refreshPromise: Promise<unknown> | null = null;

instance.interceptors.response.use(
    config => config,
    async error => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            originalRequest._isRetry = true
            try {
                if (!refreshPromise) {
                    refreshPromise = AuthService.getNewTokens().finally(() => {
                        refreshPromise = null
                    })
                }
                await refreshPromise
                return instance.request(originalRequest);
            } catch {
                removeFromStorage()
            }
        }

        throw error;
})
