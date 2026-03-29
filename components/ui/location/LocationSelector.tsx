import { ILocation, LocationService } from '@/app/services/location.service';
import { setLocations, setSelectedLocation } from '@/app/store/location/location.slice';
import { RootState } from '@/app/store/store';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function LocationSelector() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedLocationId, locations } = useSelector((state: RootState) => state.location);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
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
    staleTime: 1000 * 60 * 5, // 5 минут
    refetchOnMount: true,
    retry: 3
  });

  // Эффект для установки локаций в store
  useEffect(() => {
    if (locationsData) {
      dispatch(setLocations(locationsData));
    }
  }, [locationsData, dispatch]);

  // Отдельный эффект для инициализации выбранной локации
  useEffect(() => {
    const initializeSelectedLocation = async () => {
      if (locations.length > 0 && !selectedLocationId) {
        const defaultLocation = locations.find(loc => loc.isDefault && loc.isActive);
        const activeLocation = locations.find(loc => loc.isActive);
        const locationToSet = defaultLocation || activeLocation;

        if (locationToSet) {
          dispatch(setSelectedLocation(locationToSet.id));
          
          // Инвалидируем зависимые запросы после установки локации
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['category-products'] }),
            queryClient.invalidateQueries({ queryKey: ['products'] }),
            queryClient.invalidateQueries({ queryKey: ['get product'] }),
            queryClient.invalidateQueries({ queryKey: ['cart-products'] })
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
      queryClient.invalidateQueries({ queryKey: ['get product'] }),
      queryClient.invalidateQueries({ queryKey: ['cart-products'] })
    ]);

    // Принудительно обновляем все зависимые запросы
    await queryClient.refetchQueries({
      queryKey: ['category-products'],
      type: 'active'
    });
  };

  // Показываем лоадер только при первой загрузке
  if (isLoading && locations.length === 0) {
    return <span className="text-white">Загрузка...</span>;
  }

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  return (
    <>
      <button 
        onClick={onOpen}
        className="flex items-center gap-1 text-white hover:text-orange-500 transition-colors"
      >
        <span className="font-medium">
          {selectedLocation?.name || 'Выберите адрес'}
        </span>
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size={isMobile ? "xs" : "lg"}
        classNames={{
          base: "bg-[#1F1F1F]/90 backdrop-blur-sm",
          wrapper: "bg-[#1F1F1F]/90",
          header: "border-b border-[#2D2D2D]",
          body: isMobile ? "py-2 px-2" : "py-6",
          closeButton: "hover:bg-[#2D2D2D] active:bg-[#3D3D3D] text-white",
          backdrop: "bg-black/60",
        }}
      >
        <ModalContent className={isMobile ? "max-w-[280px] mx-auto" : ""}>
          <ModalHeader className={`flex flex-col gap-1 ${isMobile ? "p-2" : ""}`}>
            <h3 className={`${isMobile ? "text-sm" : "text-xl"} font-semibold text-white`}>
              Выберите адрес
            </h3>
            <p className={`${isMobile ? "text-[10px]" : "text-sm"} text-white`}>
              Выберите ближайший к вам ресторан
            </p>
          </ModalHeader>
          <ModalBody className={isMobile ? "pt-2 pb-3 px-2" : ""}>
            <div className={`grid ${isMobile ? "gap-1.5" : "gap-3"}`}>
              {locations.filter(loc => loc.isActive).map((location) => (
                <Button
                  key={location.id}
                  className={`w-full h-auto ${isMobile ? "p-1.5 min-h-0" : "p-4"} ${
                    selectedLocationId === location.id 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-[#2D2D2D]/90 text-white hover:bg-[#3D3D3D]'
                  } transition-colors duration-200`}
                  onClick={() => handleLocationChange(location.id)}
                >
                  <div className={`flex items-start ${isMobile ? "gap-1.5" : "gap-3"} w-full`}>
                    <div className="flex-shrink-0 mt-1">
                      <MapPin className={`${isMobile ? "w-3 h-3" : "w-5 h-5"} ${
                        selectedLocationId === location.id 
                          ? 'text-white' 
                          : 'text-orange-500'
                      }`} />
                    </div>
                    <div className="flex flex-col items-start gap-0.5 flex-grow overflow-hidden text-left w-full">
                      <span className={`font-medium ${isMobile ? "text-xs" : "text-base"} text-white text-left w-full`}>
                        {location.name}
                      </span>
                      <span className={`${isMobile ? "text-[9px] leading-[1.1] mb-1" : "text-sm"} ${
                        selectedLocationId === location.id 
                          ? 'text-white' 
                          : 'text-white/80'
                      } ${isMobile ? "line-clamp-3 break-words whitespace-normal word-break-all" : ""} w-full overflow-hidden max-w-full block text-left`}>
                        {location.address}
                      </span>
                    </div>
                    {selectedLocationId === location.id && (
                      <div className={`flex-shrink-0 ${isMobile ? "w-1 h-1" : "w-2 h-2"} rounded-full bg-white mt-2`} />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 