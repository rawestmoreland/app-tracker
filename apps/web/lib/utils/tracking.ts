import { getCookie, setCookie } from 'cookies-next';

export function hasConsent(): boolean {
  const consent = getCookie('cookie-consent-apptrack');
  return consent === 'accepted';
}

export function acceptCookies() {
  setCookie('cookie-consent-apptrack', 'accepted', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  // Dispatch event so ConditionalAnalytics can react
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('consent-updated'));
  }
}

export function declineCookies() {
  setCookie('cookie-consent-apptrack', 'declined', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  // Clear any existing tracking cookies
  clearTrackingCookies();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('consent-updated'));
  }
}

function clearTrackingCookies() {
  if (typeof window !== 'undefined') {
    // Clear Google Analytics cookies
    document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_gat=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
}
