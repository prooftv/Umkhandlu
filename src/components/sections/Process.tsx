type Step = {
  _key: string;
  title: string;
  description?: string;
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    steps?: Step[];
    footnote?: string;
  };
};

export default function Process({ section }: Props) {
  const { heading, description, steps, footnote } = section;

  if (!steps?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            {description && (
              <p className="text-xl text-gray-600">{description}</p>
            )}
          </div>

          <div className="space-y-0">
            {steps.map((step, index) => (
              <div key={step._key} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  {step.description && (
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {footnote && (
            <p className="text-sm text-gray-500 text-center mt-8 italic border-t border-gray-200 pt-6">
              {footnote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
