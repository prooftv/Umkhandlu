'use client';

import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto max-w-2xl py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">Oops</h1>
      <p className="text-xl text-gray-600 mb-8">
        Something went wrong. Please try again.
      </p>
      <Button onClick={reset} variant="default" size="lg">
        Try Again
      </Button>
    </div>
  );
}
