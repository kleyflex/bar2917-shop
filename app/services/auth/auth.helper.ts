import { IAuthResponse, ITokens } from '@/app/store/user/user.interface';
import Cookies from 'js-cookie';

// Синхронизация в беком 
const ACCESS_TOKEN_EXPIRES_DAYS = 1 / 24; // access 1 час,
const REFRESH_TOKEN_EXPIRES_DAYS = 30; // refresh 30 дней

const cookieOptions = (expiresDays: number): Cookies.CookieAttributes => ({
  expires: expiresDays,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
});

export const getAccessToken = () => {
    const accessToken = Cookies.get('accessToken')
    return accessToken || null
}

export const getRefreshToken = () => {
  const refreshToken = Cookies.get('refreshToken')
  return refreshToken || null
}

export const getUserFromStorage = () => {
    return JSON.parse(localStorage.getItem('user') || '{}')
}

export const saveTokensStorage = (data: ITokens) => {
  Cookies.set('accessToken', data.accessToken, cookieOptions(ACCESS_TOKEN_EXPIRES_DAYS));
  Cookies.set('refreshToken', data.refreshToken, cookieOptions(REFRESH_TOKEN_EXPIRES_DAYS));
};

export const removeFromStorage = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('user')
};

export const saveToStorage = (data: IAuthResponse) => {
  saveTokensStorage(data);
  localStorage.setItem('user', JSON.stringify(data.user));
};
