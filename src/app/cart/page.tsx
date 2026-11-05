import type { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review the items in your cart.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartClient />;
}
