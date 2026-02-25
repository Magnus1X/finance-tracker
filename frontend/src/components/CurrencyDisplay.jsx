import React from 'react';
import { getCurrencyParts } from '../utils/currency';
import { useAuth } from '../context/AuthContext';

const CurrencyDisplay = ({ amount, code = 'INR', className = "", symbolClassName = "", valueClassName = "" }) => {
    const { user } = useAuth();
    const { symbol, value } = getCurrencyParts(amount || 0, code || user?.currency || 'INR');

    return (
        <span className={`inline-flex items-baseline ${className}`}>
            <span className={`text-[1em] font-black mr-1 text-inherit ${symbolClassName}`}>
                {symbol}
            </span>
            <span className={`font-financial ${valueClassName}`}>
                {value}
            </span>
        </span>
    );
};

export default CurrencyDisplay;
