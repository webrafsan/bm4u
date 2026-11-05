import type { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin dashboard.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminClient />;
}
