'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { hasConsent } from '@/lib/utils/tracking';

export function ConditionalAnalytics({ gaId }: { gaId: string }) {
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    setShowAnalytics(hasConsent());

    const handleConsentChange = () => {
      setShowAnalytics(hasConsent());
    };

    window.addEventListener('consent-updated', handleConsentChange);
    return () =>
      window.removeEventListener('consent-updated', handleConsentChange);
  }, []);

  if (!showAnalytics) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
