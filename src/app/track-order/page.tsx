import type { Metadata } from 'next';
import TrackOrderClient from './TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track the status of your BM 4 U order.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TrackOrderClient />;
}
