import type { Metadata } from 'next';
import OrderSuccessClient from './OrderSuccessClient';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your order confirmation.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrderSuccessClient />;
}
