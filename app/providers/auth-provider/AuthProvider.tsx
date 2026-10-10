'use client'

import { ADMIN_PANEL_URL } from "@/app/config/url.config";
import { getAccessToken, getRefreshToken } from "@/app/services/auth/auth.helper";
import { restoreUser } from "@/app/store/user/user.slice";
import { getStoreLocal } from "@/lib/utils/local-storage";
import { useActions } from "@/components/hocs/useActions";
import { useAuth } from "@/components/hocs/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";
import { useDispatch } from "react-redux";
import { protectedRoutes } from "./protected-routes.data";

const AuthProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { user, isInitialized } = useAuth();
  const { checkAuth, logout } = useActions();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    dispatch(restoreUser(getStoreLocal('user')));

    const accessToken = getAccessToken();
    if (accessToken) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    const refreshToken = getRefreshToken();
    if (!refreshToken && user) {
      logout();
    }
  }, [pathname, isInitialized]);

  const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route))
  const isAdminRoute = pathname?.startsWith(ADMIN_PANEL_URL)

  const isDeniedAdmin = Boolean(isAdminRoute && user && !user.isAdmin)
  const isUnauthorized = Boolean((isProtectedRoute || isAdminRoute) && !user)

  useEffect(() => {
    // Пока пользователь не восстановлен, «не авторизован» может быть ложным
    if (!isInitialized) return

    if (isDeniedAdmin) {
      router.push('/')
      return
    }

    if (isUnauthorized && pathname !== '/') {
      router.replace('/')
    }
  }, [isDeniedAdmin, isUnauthorized, pathname, isInitialized])

  if (!isProtectedRoute && !isAdminRoute) {
    return <>{children}</>
  }

  if (user?.isAdmin) {
    return <>{children}</>
  }

  if (user && isProtectedRoute) {
    return <>{children}</>
  }

  return null
}

export default AuthProvider;
