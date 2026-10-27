import { PRODUCTS } from '@/data/products';
import ProductClient from './ProductClient';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
