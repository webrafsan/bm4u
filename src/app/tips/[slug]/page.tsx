import { POSTS } from '@/data/posts';
import TipClient from './TipClient';

export function generateStaticParams() {
  return POSTS.map(p => ({
    slug: p.slug,
  }));
}

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TipClient slug={slug} />;
}
