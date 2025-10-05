export const CURRENCIES = [
  { currencyCode: 'USD', symbol: '$', locale: 'en-US' },
  { currencyCode: 'EUR', symbol: '€', locale: 'de-DE' },
  { currencyCode: 'GBP', symbol: '£', locale: 'en-GB' },
  { currencyCode: 'JPY', symbol: '¥', locale: 'ja-JP' },
  { currencyCode: 'CNY', symbol: '¥', locale: 'zh-CN' },
  { currencyCode: 'INR', symbol: '₹', locale: 'en-IN' },
  { currencyCode: 'AUD', symbol: 'A$', locale: 'en-AU' },
  { currencyCode: 'CAD', symbol: 'C$', locale: 'en-CA' },
  { currencyCode: 'CHF', symbol: 'Fr', locale: 'de-CH' },
  { currencyCode: 'SEK', symbol: 'kr', locale: 'sv-SE' },
  { currencyCode: 'NZD', symbol: 'NZ$', locale: 'en-NZ' },
  { currencyCode: 'KRW', symbol: '₩', locale: 'ko-KR' },
  { currencyCode: 'SGD', symbol: 'S$', locale: 'en-SG' },
  { currencyCode: 'NOK', symbol: 'kr', locale: 'nb-NO' },
  { currencyCode: 'MXN', symbol: '$', locale: 'es-MX' },
  { currencyCode: 'BRL', symbol: 'R$', locale: 'pt-BR' },
  { currencyCode: 'RUB', symbol: '₽', locale: 'ru-RU' },
  { currencyCode: 'ZAR', symbol: 'R', locale: 'en-ZA' },
  { currencyCode: 'TRY', symbol: '₺', locale: 'tr-TR' },
  { currencyCode: 'HKD', symbol: 'HK$', locale: 'zh-HK' },
  { currencyCode: 'DKK', symbol: 'kr', locale: 'da-DK' },
  { currencyCode: 'PLN', symbol: 'zł', locale: 'pl-PL' },
  { currencyCode: 'THB', symbol: '฿', locale: 'th-TH' },
  { currencyCode: 'IDR', symbol: 'Rp', locale: 'id-ID' },
  { currencyCode: 'MYR', symbol: 'RM', locale: 'ms-MY' },
  { currencyCode: 'PHP', symbol: '₱', locale: 'en-PH' },
  { currencyCode: 'CZK', symbol: 'Kč', locale: 'cs-CZ' },
  { currencyCode: 'AED', symbol: 'د.إ', locale: 'ar-AE' },
  { currencyCode: 'SAR', symbol: '﷼', locale: 'ar-SA' },
  { currencyCode: 'ILS', symbol: '₪', locale: 'he-IL' },
];

export function getCurrencySymbol(currencyCode: string) {
  return CURRENCIES.find((currency) => currency.currencyCode === currencyCode)
    ?.symbol;
}
