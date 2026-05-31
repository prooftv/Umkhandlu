'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90"
    >
      Print / Save as PDF
    </button>
  );
}
