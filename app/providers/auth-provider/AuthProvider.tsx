'use client'

import { ADMIN_PANEL_URL } from "@/app/config/url.config";
import { getAccessToken, getRefreshToken } from "@/app/services/auth/auth.helper";
import { useActions } from "@/components/hocs/useActions";
import { useAuth } from "@/components/hocs/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";
import { protectedRoutes } from "./protected-routes.data";

const AuthProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { user } = useAuth();
  const { checkAuth, logout } = useActions();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (!refreshToken && user) {
      logout();
    }
  }, [pathname]);

  const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route))
  const isAdminRoute = pathname?.startsWith(ADMIN_PANEL_URL)

  const isDeniedAdmin = Boolean(isAdminRoute && user && !user.isAdmin)
  const isUnauthorized = Boolean((isProtectedRoute || isAdminRoute) && !user)

  useEffect(() => {
    if (isDeniedAdmin) {
      router.push('/')
      return
    }

    if (isUnauthorized && pathname !== '/auth') {
      router.replace('/auth')
    }
  }, [isDeniedAdmin, isUnauthorized, pathname])

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
