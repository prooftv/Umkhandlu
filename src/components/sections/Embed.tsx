type Props = {
  section: {
    heading?: string;
    url?: string;
    aspectRatio?: '16/9' | '4/3' | '1/1';
  };
};

export default function Embed({ section }: Props) {
  const { heading, url, aspectRatio = '16/9' } = section;

  if (!url) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4 max-w-4xl">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
        )}
        <div
          className="relative w-full overflow-hidden rounded-xl"
          style={{ aspectRatio }}
        >
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={heading || 'Embedded content'}
          />
        </div>
      </div>
    </section>
  );
}
