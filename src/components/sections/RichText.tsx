import type { PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/modules/PortableText';

type Props = {
  section: {
    heading?: string;
    content?: PortableTextBlock[];
  };
};

export default function RichText({ section }: Props) {
  const { heading, content } = section;

  if (!content) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto max-w-3xl">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8">{heading}</h2>
        )}
        <PortableText value={content} />
      </div>
    </section>
  );
}
