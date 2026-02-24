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

export const getCurrencySymbol = (code = 'INR') => {
  const currency = currencies.find((c) => c.code === code);
  return currency ? currency.symbol : '₹';
};

export const formatCurrency = (amount, code = 'INR') => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (err) {
    const symbol = getCurrencySymbol(code);
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }
};

export const getCurrencyParts = (amount, code = 'INR') => {
  try {
    const parts = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
    }).formatToParts(amount);

    return {
      symbol: parts.find(p => p.type === 'currency')?.value || '',
      value: parts.filter(p => p.type !== 'currency').map(p => p.value).join('').trim(),
      currencyPart: parts.find(p => p.type === 'currency'),
      literalPart: parts.find(p => p.type === 'literal')
    };
  } catch (err) {
    return {
      symbol: getCurrencySymbol(code),
      value: amount.toLocaleString(undefined, { minimumFractionDigits: 2 })
    };
  }
};
