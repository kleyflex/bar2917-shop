import { IProduct } from "@/app/types/product.interface";
import ProductItem from "@/components/ui/catalog/product-item/ProductItem";
import ProductCarousel from "@/components/ui/ProductCarousel";

interface ISimilarProducts {
  similarProducts: IProduct[];
}

// Сервер уже выбрал случайные товары той же категории, доступные в точке, с её ценами
export default function SimilarProducts({ similarProducts }: ISimilarProducts) {
  if (!similarProducts.length) return null;

  return (
    <ProductCarousel
      title="Возможно вам понравится:"
      products={similarProducts}
      renderItem={(product) => <ProductItem key={product.id} product={product} />}
    />
  );
}
