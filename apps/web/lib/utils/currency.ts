export const CURRENCIES = [
  { currencyCode: 'USD', symbol: '$' },
  { currencyCode: 'EUR', symbol: '€' },
  { currencyCode: 'GBP', symbol: '£' },
  { currencyCode: 'JPY', symbol: '¥' },
  { currencyCode: 'CNY', symbol: '¥' },
  { currencyCode: 'INR', symbol: '₹' },
  { currencyCode: 'AUD', symbol: 'A$' },
  { currencyCode: 'CAD', symbol: 'C$' },
  { currencyCode: 'CHF', symbol: 'Fr' },
  { currencyCode: 'SEK', symbol: 'kr' },
  { currencyCode: 'NZD', symbol: 'NZ$' },
  { currencyCode: 'KRW', symbol: '₩' },
  { currencyCode: 'SGD', symbol: 'S$' },
  { currencyCode: 'NOK', symbol: 'kr' },
  { currencyCode: 'MXN', symbol: '$' },
  { currencyCode: 'BRL', symbol: 'R$' },
  { currencyCode: 'RUB', symbol: '₽' },
  { currencyCode: 'ZAR', symbol: 'R' },
  { currencyCode: 'TRY', symbol: '₺' },
  { currencyCode: 'HKD', symbol: 'HK$' },
  { currencyCode: 'DKK', symbol: 'kr' },
  { currencyCode: 'PLN', symbol: 'zł' },
  { currencyCode: 'THB', symbol: '฿' },
  { currencyCode: 'IDR', symbol: 'Rp' },
  { currencyCode: 'MYR', symbol: 'RM' },
  { currencyCode: 'PHP', symbol: '₱' },
  { currencyCode: 'CZK', symbol: 'Kč' },
  { currencyCode: 'AED', symbol: 'د.إ' },
  { currencyCode: 'SAR', symbol: '﷼' },
  { currencyCode: 'ILS', symbol: '₪' },
];

export function getCurrencySymbol(currencyCode: string) {
  return CURRENCIES.find((currency) => currency.currencyCode === currencyCode)
    ?.symbol;
}
