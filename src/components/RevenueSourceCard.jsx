import React, { memo, useState, useRef, useEffect } from 'react';
import pdfIcon from '../assets/images/icons/pdf.svg';
import gsap from 'gsap';
import './RevenueSourceCard.css'; // Asegúrate de importar el archivo CSS

const RevenueSourceCard = memo(
    ({
        source,
        balance,
        isSelected,
        handleCardClick,
        exchangeRates,
    }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [convertedAmount, setConvertedAmount] = useState(null);
        const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
        const conversionRef = useRef(null);
        const hasBalance = balance !== undefined;

        // Define the order of currencies for conversion
        const conversionOrder = {
            'EUR': ['GBP', 'USD'],
            'USD': ['EUR', 'GBP'],
            'GBP': ['USD', 'EUR']
        };

        // Function to get the currency symbol
        const getCurrencySymbol = (currencyCode) => {
            switch (currencyCode) {
                case 'EUR': return '€';
                case 'GBP': return '£';
                case 'USD': return '$';
                default: return currencyCode;
            }
        };

        // Function to determine the color class based on available amount
        const getColorClass = (amount) => {
            const maxAmount = 1000; // Assuming maxAmount is known or can be derived
            const firstThird = maxAmount / 3;
            const secondThird = 2 * firstThird;

            if (amount <= firstThird) {
                return 'red';
            } else if (amount <= secondThird) {
                return 'orange';
            } else {
                return 'green';
            }
        };

        // Function to calculate the converted amount
        const getConvertedAmountValue = (currencyCode, availableamount) => {
            if (!exchangeRates || !currencyCode) return null;

            const otherCurrencies = conversionOrder[currencyCode] || [];
            const targetCurrency = otherCurrencies[currentCurrencyIndex];

            const rateKey = `${currencyCode}_${targetCurrency}`;
            const exchangeRate = exchangeRates[rateKey];

            if (exchangeRate) {
                return (availableamount * exchangeRate).toFixed(2);
            } else {
                return null;
            }
        };

        useEffect(() => {
            let intervalId;

            if (isHovered && hasBalance) {
                // Set the initial converted amount
                setConvertedAmount(getConvertedAmountValue(balance.currency_code, balance.availableamount));

                // Set up the interval to cycle through currencies
                intervalId = setInterval(() => {
                    setCurrentCurrencyIndex((prevIndex) => (prevIndex + 1) % (conversionOrder[balance.currency_code]?.length || 1));
                }, 3000); // Change currency every 3 seconds
            } else {
                // Clear the interval and reset state when not hovered
                clearInterval(intervalId);
                setCurrentCurrencyIndex(0);
                setConvertedAmount(null);
            }

            return () => clearInterval(intervalId); // Cleanup on unmount or when isHovered changes
        }, [isHovered, hasBalance, balance?.currency_code, balance?.availableamount, exchangeRates]);

        useEffect(() => {
            if (conversionRef.current) {
                gsap.to(conversionRef.current, {
                    opacity: isHovered && hasBalance ? 1 : 0,
                    duration: 0.3,
                });
            }
        }, [isHovered, hasBalance, convertedAmount]);

        const originalAmount = balance ? `${balance.availableamount}${getCurrencySymbol(balance.currency_code)}` : '';
        const currencySymbol = balance && isHovered && hasBalance && getConvertedAmountValue(balance.currency_code, balance.availableamount) ? getCurrencySymbol(conversionOrder[balance.currency_code][currentCurrencyIndex]) : null;
        const convertedValue = balance && isHovered && hasBalance ? getConvertedAmountValue(balance.currency_code, balance.availableamount) : null

        return (
            <div
                key={source.revenue_source_id}
                className={`combined-component-card ${isSelected ? 'selected' : ''} ${!hasBalance ? 'no-balance' : ''}`}
                onClick={() => handleCardClick(source.revenue_source_id)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isSelected && <img src={pdfIcon} alt="PDF Icon" className="card-pdf-icon" />}
                <h3>{source.revenue_source_name}</h3>
                {balance ? (
                    <>
                        <p className="available-amount-label">Available Amount</p>
                        <div className="amount-container">
                            <p className={`available-amount-value ${getColorClass(balance.availableamount)}`}>
                                {originalAmount}
                            </p>
                        </div>
                        <div
                            className="conversion-display"
                            ref={conversionRef}
                        >
                            {isHovered && hasBalance && convertedValue ? `≈ ${convertedValue}${currencySymbol}` : 'Conversion not available'}
                        </div>
                    </>
                ) : (
                    <p>No available amount</p>
                )}
            </div>
        );
    }
);

export default RevenueSourceCard;
