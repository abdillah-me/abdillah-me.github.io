import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';

export function PostList() {
  return (
    <div className="flex flex-col">
      {data.blog.map((post) => (
        <div key={post.title} className="block py-6 border-b-[1.5px] border-ink/15">
          <div className="flex justify-between items-baseline gap-3 flex-wrap">
            <div className="font-bold text-lg">{post.title}</div>
            <div className="font-mono text-xs text-ink-dim whitespace-nowrap">{post.date}</div>
          </div>
          <div className="text-[14.5px] text-ink-dim mt-2 leading-relaxed">{post.excerpt}</div>
          <div className="flex gap-2 mt-3">
            {post.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
