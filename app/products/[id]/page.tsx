import ProductDetailPage from '@/components/ProductDetailPage';

export default function ProductDetail({ params }: { params: { id: string } }) {
  return <ProductDetailPage productId={params.id} />;
}

