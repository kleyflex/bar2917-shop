'use client'

import { ILocation, LocationService } from '@/app/services/location.service';
import { setLocations, setSelectedLocation } from '@/app/store/location/location.slice';
import { RootState } from '@/app/store/store';
import { Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function LocationSelectorHero() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedLocationId, locations } = useSelector((state: RootState) => state.location);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const { data: locationsData, isLoading } = useQuery<ILocation[]>({
    queryKey: ['locations'],
    queryFn: () => LocationService.getAll(),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    retry: 3
  });

  // Установка локаций в store
  useEffect(() => {
    if (locationsData) {
      dispatch(setLocations(locationsData));
    }
  }, [locationsData, dispatch]);

  // Инициализация выбранной локации
  useEffect(() => {
    const initializeSelectedLocation = async () => {
      if (locations.length > 0 && !selectedLocationId) {
        const defaultLocation = locations.find(loc => loc.isDefault && loc.isActive);
        const activeLocation = locations.find(loc => loc.isActive);
        const locationToSet = defaultLocation || activeLocation;
        
        if (locationToSet) {
          dispatch(setSelectedLocation(locationToSet.id));
          
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['category-products'] }),
            queryClient.invalidateQueries({ queryKey: ['products'] }),
            queryClient.invalidateQueries({ queryKey: ['main-products'] })
          ]);
        }
      }
    };

    initializeSelectedLocation();
  }, [locations, selectedLocationId, dispatch, queryClient]);

  const handleLocationChange = async (locationId: number) => {
    dispatch(setSelectedLocation(locationId));
    onClose();

    // Инвалидируем все зависимые запросы
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['category-products'] }),
      queryClient.invalidateQueries({ queryKey: ['products'] }),
      queryClient.invalidateQueries({ queryKey: ['main-products'] }),
      queryClient.invalidateQueries({ queryKey: ['cart-products'] })
    ]);

    await queryClient.refetchQueries({
      queryKey: ['main-products'],
      type: 'active'
    });
  };

  if (isLoading && locations.length === 0) {
    return null;
  }

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  return (
    <div className="w-full py-3 px-4 sm:px-0">
      <Card className="location-selector-hero">
        <CardBody className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3">
            {/* Левая часть - информация */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 flex-1">
              <div className="p-1.5 bg-mainprimary/15 rounded-full sm:mt-0.5">
                <MapPin className="w-4 h-4 text-mainprimary" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-medium text-white mb-0.5">
                  Адрес ресторана
                </h3>
                <p className="text-xs text-gray-400">
                  {selectedLocation ? (
                    <span className="text-orange-400 font-medium">{selectedLocation.address}</span>
                  ) : (
                    'Выберите ближайший к вам ресторан'
                  )}
                </p>
              </div>
            </div>

            {/* Правая часть - кнопка */}
            <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
              <Button
                onClick={onOpen}
                className="location-selector-button text-white font-medium px-4 py-1.5 h-auto min-h-0 text-sm w-full sm:w-auto"
                endContent={<ChevronDown className="w-3 h-3" />}
                size="sm"
              >
                {selectedLocation ? 'Изменить' : 'Выбрать'}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Модальное окно */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size={isMobile ? "sm" : "2xl"}
        classNames={{
          base: "bg-[#1F1F1F]/95 backdrop-blur-md",
          wrapper: "bg-[#1F1F1F]/95",
          header: "border-b border-[#2D2D2D]",
          body: isMobile ? "py-4 px-4" : "py-6",
          closeButton: "hover:bg-[#2D2D2D] active:bg-[#3D3D3D] text-white",
          backdrop: "bg-black/70",
        }}
      >
        <ModalContent className={isMobile ? "max-w-[350px] mx-auto" : ""}>
          <ModalHeader className={`flex flex-col gap-1 ${isMobile ? "p-4" : ""}`}>
            <h3 className={`${isMobile ? "text-lg" : "text-2xl"} font-bold text-white flex items-center gap-2`}>
              <MapPin className="w-6 h-6 text-mainprimary" />
              Выберите ресторан
            </h3>
            <p className={`${isMobile ? "text-sm" : "text-base"} text-gray-300`}>
              Выберите ближайший к вам ресторан для доставки
            </p>
          </ModalHeader>
          <ModalBody className={isMobile ? "pt-2 pb-4 px-4" : ""}>
            <div className={`grid ${isMobile ? "gap-3" : "gap-4"}`}>
              {locations.filter(loc => loc.isActive).map((location) => (
                <Button
                  key={location.id}
                  className={`w-full h-auto ${isMobile ? "p-4" : "p-6"} ${
                    selectedLocationId === location.id 
                      ? 'bg-gradient-to-r from-mainprimary to-mainprimary text-white hover:opacity-90 shadow-lg' 
                      : 'bg-[#2D2D2D]/90 text-white hover:bg-[#3D3D3D] border border-[#3D3D3D] hover:border-mainprimary/50'
                  } transition-all duration-300 transform hover:scale-[1.02]`}
                  onClick={() => handleLocationChange(location.id)}
                >
                  <div className={`flex items-start ${isMobile ? "gap-3" : "gap-4"} w-full`}>
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-2 rounded-full ${
                        selectedLocationId === location.id 
                          ? 'bg-white/20' 
                          : 'bg-mainprimary/20'
                      }`}>
                        <MapPin className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} ${
                          selectedLocationId === location.id 
                            ? 'text-white' 
                            : 'text-mainprimary'
                        }`} />
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1 flex-grow overflow-hidden text-left w-full">
                      <span className={`font-semibold ${isMobile ? "text-sm" : "text-lg"} text-white text-left w-full`}>
                        {location.name}
                      </span>
                      <span className={`${isMobile ? "text-xs" : "text-sm"} ${
                        selectedLocationId === location.id 
                          ? 'text-white/90' 
                          : 'text-gray-300'
                      } w-full text-left leading-relaxed`}>
                        {location.address}
                      </span>
                      <span className={`${isMobile ? "text-xs" : "text-sm"} ${
                        selectedLocationId === location.id 
                          ? 'text-white/80' 
                          : 'text-orange-400'
                      } font-medium`}>
                        {location.phone}
                      </span>
                    </div>
                    {selectedLocationId === location.id && (
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <div className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} rounded-full bg-white shadow-lg`} />
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}