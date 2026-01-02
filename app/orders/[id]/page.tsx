import OrderDetailPage from '@/components/OrderDetailPage';

export default function OrderDetail({ params }: { params: { id: string } }) {
  return <OrderDetailPage orderId={params.id} />;
}

