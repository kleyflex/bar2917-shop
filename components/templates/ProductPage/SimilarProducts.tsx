import { TypeRootState } from "@/app/store/store";
import { ILocation } from "@/app/types/location.interface";
import { IProduct } from "@/app/types/product.interface";
import ProductItem from "@/components/ui/catalog/product-item/ProductItem";
import ProductCarousel from "@/components/ui/ProductCarousel";
import { useSelector } from "react-redux";

interface ISimilarProducts {
  similarProducts: IProduct[];
}

export default function SimilarProducts({ similarProducts }: ISimilarProducts) {
  const { locations, selectedLocationId } = useSelector((state: TypeRootState) => state.location);
  
  const getRandomProducts = (products: IProduct[], max: number) => {
    // Перемешиваем массив продуктов
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    // Возвращаем максимум `max` продуктов
    return shuffled.slice(0, max);
  };

  const currentLocation = selectedLocationId 
    ? locations.find((loc: ILocation) => loc.id === selectedLocationId)
    : locations.find((loc: ILocation) => loc.isDefault && loc.isActive) || 
      locations.find((loc: ILocation) => loc.isActive);

  const getProductWithPrice = (product: IProduct) => {
    const locationProduct = currentLocation?.products.find(
      item => item.product.id === product.id
    );

    return {
      ...product,
      price: locationProduct?.price || product.price,
      isAvailable: locationProduct?.isAvailable || false
    };
  };
  const randomProducts = getRandomProducts(similarProducts, 3)
    .map(product => getProductWithPrice(product));

  if (!randomProducts.length) {
    return <div className="text-white">Здесь нет продуктов</div>;
  }

  return (
    <ProductCarousel
      title="Возможно вам понравится:"
      products={randomProducts}
      renderItem={(product) => <ProductItem key={product.id} product={product} />}
    />
  );
}
