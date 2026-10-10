'use client'
import { TypeRootState } from '@/app/store/store'
import { ILocation } from '@/app/types/location.interface'
import { createContext, PropsWithChildren, useContext } from 'react'
import { useSelector } from 'react-redux'

interface IServerLocation {
  locations: ILocation[]
  locationId: number | null
}

const ServerLocationContext = createContext<IServerLocation>({ locations: [], locationId: null })

// Точки и выбранная точка, известные серверу (cookie). Нужны, чтобы шапка и футер в HTML
// сразу показывали адрес и телефон, а не «Загрузка...», пока Redux не восстановлен из localStorage
export const ServerLocationProvider = ({ locations, locationId, children }: PropsWithChildren<IServerLocation>) => (
  <ServerLocationContext.Provider value={{ locations, locationId }}>
    {children}
  </ServerLocationContext.Provider>
)

export const useServerLocation = () => useContext(ServerLocationContext)

// Для отображения: данные Redux, а до их восстановления — серверные
export const useCurrentLocation = () => {
  const { locations, selectedLocationId } = useSelector((state: TypeRootState) => state.location)
  const server = useServerLocation()

  const list = locations.length ? locations : server.locations
  const id = selectedLocationId ?? server.locationId

  return {
    locations: list,
    selectedLocationId: id,
    selectedLocation: list.find(location => location.id === id)
  }
}
