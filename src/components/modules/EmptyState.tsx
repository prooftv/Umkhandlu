type Props = {
  title?: string;
  description?: string;
  icon?: string;
};

export function EmptyState({
  title = 'Nothing here yet',
  description,
  icon = '📭',
}: Props) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-12 text-center">
      <p className="text-3xl mb-3">{icon}</p>
      <p className="font-semibold text-gray-700">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
