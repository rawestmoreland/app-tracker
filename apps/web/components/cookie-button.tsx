'use client';

export default function CookieButton() {
  return (
    <button
      onClick={() => {
        // Clear consent to show banner again
        document.cookie =
          'cookie-consent-apptrack=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.reload();
      }}
      className="text-sm underline"
    >
      Cookie Settings
    </button>
  );
}
