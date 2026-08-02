'use client'
import { NextUIProvider } from "@nextui-org/react"
import { QueryClientProvider } from "@tanstack/react-query"
import dynamic from 'next/dynamic'
import { Next13ProgressBar } from 'next13-progressbar'
import { PropsWithChildren } from "react"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { queryClient } from "../api/query.client"
import { persistor, store } from "../store/store"
import AuthProvider from "./auth-provider/AuthProvider"

// CookieBanner работает только в браузере
const CookieBanner = dynamic(() => import('@/components/ui/CookieBanner'), {
    ssr: false
});

export default function Providers({
   children
}: PropsWithChildren<unknown>) {
    const content = (
        <AuthProvider>
            <Toaster position="top-center" containerClassName="toaster-container" />
            <Next13ProgressBar height='3px' color='#FF8A00' showOnShallow/>
            <NextUIProvider>
                {children}
            </NextUIProvider>
            <CookieBanner />
        </AuthProvider>
    );

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={content} persistor={persistor}>
                    {content}
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    )
}
