type StatItem = {
  _key: string;
  value: string;
  label: string;
};

type Props = {
  section: {
    heading?: string;
    items?: StatItem[];
  };
};

export default function Stats({ section }: Props) {
  const { heading, items } = section;

  if (!items?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          {items.map((stat) => (
            <div key={stat._key}>
              <p className="text-4xl md:text-5xl font-bold text-pink-500 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
