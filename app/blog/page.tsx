import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { PostList } from '@/components/blog/post-list';
import { data } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Tulisan',
  description: `Tulisan teknis dari ${data.profile.name} seputar software engineering dan otomasi.`,
};

export default function BlogPage() {
  return (
    <div className="font-sans text-ink min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 max-w-[800px] mx-auto px-6 py-14 w-full">
        <div className="font-mono text-sm text-accent-green mb-2">$ ls ./blog --recent</div>
        <h1 className="text-[42px] font-bold mb-10 tracking-tight">Tulisan</h1>
        <PostList />
      </div>
      <Footer />
    </div>
  );
}
