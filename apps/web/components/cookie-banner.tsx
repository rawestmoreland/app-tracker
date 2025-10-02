'use client';

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { acceptCookies, declineCookies } from '@/lib/utils/tracking';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getCookie('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    acceptCookies();
    setShowBanner(false);
  };

  const handleDecline = () => {
    declineCookies();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 bg-gray-900 p-4 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-sm">
          We use cookies to improve your experience and analyze site traffic.
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
