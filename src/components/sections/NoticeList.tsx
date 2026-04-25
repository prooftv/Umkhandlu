import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type Notice = {
  _id: string;
  title: string;
  slug: string;
  noticeType: string;
  date: string;
  excerpt?: string;
  pinned?: boolean;
};

type Props = {
  section: {
    heading?: string;
    notices?: Notice[];
  };
};

const typeColors: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  meeting: 'default',
  announcement: 'secondary',
  alert: 'destructive',
  opportunity: 'outline',
};

export default function NoticeList({ section }: Props) {
  const { heading, notices } = section;

  if (!notices?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
          <div className="space-y-4">
            {notices.map((notice) => (
              <article
                key={notice._id}
                className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={typeColors[notice.noticeType] || 'outline'}
                      >
                        {notice.noticeType}
                      </Badge>
                      {notice.pinned && (
                        <span className="text-xs text-pink-600 font-medium">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {notice.title}
                    </h3>
                    {notice.excerpt && (
                      <p className="text-gray-600 text-sm">{notice.excerpt}</p>
                    )}
                  </div>
                  {notice.date && (
                    <time
                      dateTime={notice.date}
                      className="text-sm text-gray-400 whitespace-nowrap"
                    >
                      {new Date(notice.date).toLocaleDateString()}
                    </time>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/notices">
                View All Notices <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
