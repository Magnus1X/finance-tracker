export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

export const getCurrencySymbol = (code) => {
  const currency = currencies.find((c) => c.code === code);
  return currency ? currency.symbol : '$';
};

export const formatCurrency = (amount, code) => {
  const symbol = getCurrencySymbol(code);
  return `${symbol}${amount.toFixed(2)}`;
};
