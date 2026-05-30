'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const CONSENT_KEY = 'cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      data-cookie-consent
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6"
    >
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 text-center md:text-left">
          This site uses cookies to improve your experience. By continuing to
          use this site, you consent to our use of cookies in accordance with
          POPIA.
        </p>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={decline}>
            Decline
          </Button>
          <Button variant="default" size="sm" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
