'use client'
import { TypeRootState } from '@/app/store/store'
import { LOCATION_COOKIE } from '@/app/types/location.interface'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

interface ILocationCookieSync {
  // Точка, для которой сервер отрендерил текущую страницу
  serverLocationId: number | null
}

// Держит cookie в соответствии с выбранной точкой. Если сервер рендерил другую точку —
// router.refresh() перерисует серверные компоненты (меню, каталог, цены) с новой cookie
const LocationCookieSync = ({ serverLocationId }: ILocationCookieSync) => {
  const selectedLocationId = useSelector((state: TypeRootState) => state.location.selectedLocationId)
  const router = useRouter()
  // Не больше одного refresh на точку: если cookie заблокированы или точки уже нет на сервере,
  // сервер так и будет отдавать другую точку — без этой защиты получился бы бесконечный цикл
  const refreshedFor = useRef<number | null>(null)

  useEffect(() => {
    if (!selectedLocationId) return

    if (Cookies.get(LOCATION_COOKIE) !== String(selectedLocationId)) {
      Cookies.set(LOCATION_COOKIE, String(selectedLocationId), { expires: 365, sameSite: 'lax', path: '/' })
    }

    const isCookieSaved = Cookies.get(LOCATION_COOKIE) === String(selectedLocationId)

    if (
      isCookieSaved &&
      serverLocationId !== null &&
      serverLocationId !== selectedLocationId &&
      refreshedFor.current !== selectedLocationId
    ) {
      refreshedFor.current = selectedLocationId
      router.refresh()
    }
  }, [selectedLocationId, serverLocationId, router])

  return null
}

export default LocationCookieSync
