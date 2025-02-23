import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RevenueSources.css';
import revenueSourcesData from '../assets/data/revenueSources';
import availableBalancesData from '../assets/data/availableBalances';
import pdfReports from '../assets/data/pdfReports';
import { generateMultiplePDFs } from '../utils/pdfGenerator';
import pdfIcon from '../assets/images/icons/pdf.svg';
import filterIcon from '../assets/images/icons/filters.svg';
import { Slider } from '@ark-ui/react';
import gsap from 'gsap';
import SearchInput from './SearchInput';

function CombinedComponent() {
    const [revenueSources, setRevenueSources] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSources, setSelectedSources] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [amountFilterValue, setAmountFilterValue] = useState(0);
    const [maxAmount, setMaxAmount] = useState(0);
    const [minAmount, setMinAmount] = useState(0);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [selectedCurrencies, setSelectedCurrencies] = useState(['EUR', 'GBP', 'USD']);
    const availableCurrencies = ['EUR', 'GBP', 'USD'];
    const filterRef = useRef(null);
    const cardRefs = useRef([]);

    // Initialize filteredSources and filteredBalances with an empty array
    const [filteredSources, setFilteredSources] = useState([]);
    const [filteredBalances, setFilteredBalances] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const sortedData = [...revenueSourcesData].sort((a, b) =>
                a.revenue_source_name.localeCompare(b.revenue_source_name)
            );
            setRevenueSources(sortedData);

            const amounts = availableBalancesData.map(bal => bal.availableamount);
            const calculatedMaxAmount = Math.max(...amounts, 0);
            setMaxAmount(calculatedMaxAmount);
            setAmountFilterValue(calculatedMaxAmount);

            setIsDataLoaded(true);
        };

        fetchData();

        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handler to update filteredSources based on searchTerm
    useEffect(() => {
        const newFilteredSources = revenueSources.filter(source =>
            source.revenue_source_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSources(newFilteredSources);
    }, [revenueSources, searchTerm]);

    // Handler to update filteredBalances based on amountFilterValue and selectedCurrencies
    useEffect(() => {
        const newFilteredBalances = availableBalancesData.filter(balance => {
            const amountValid = balance.availableamount >= 0 && balance.availableamount <= amountFilterValue;
            const currencyValid = selectedCurrencies.includes(balance.currency_code);
            return amountValid && currencyValid;
        });
        setFilteredBalances(newFilteredBalances);
    }, [amountFilterValue, selectedCurrencies]);

    // Function to handle card transitions
    const updateCardVisibility = useCallback(() => {
        cardRefs.current.forEach((card, index) => {
            if (card) {
                const source = filteredSources[index];
                const balance = filteredBalances.find(bal => bal.revenue_source_name === source?.revenue_source_name);
                const hasBalance = balance !== undefined;

                if (!hasBalance) {
                    gsap.to(card, {
                        opacity: 0,
                        height: 'auto',
                        duration: 0.3,
                        display: 'none',
                        overwrite: true,
                    });
                } else {
                    gsap.to(card, {
                        opacity: 1,
                        height: 'auto',
                        duration: 0.3,
                        display: 'block',
                        overwrite: true,
                    });
                }
            }
        });
    }, [filteredBalances, filteredSources]);

    useEffect(() => {
        if (isDataLoaded) {
            updateCardVisibility();
        }
    }, [filteredBalances, filteredSources, isDataLoaded, updateCardVisibility]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCardClick = (sourceId) => {
        setSelectedSources(prev =>
            prev.includes(sourceId)
                ? prev.filter(id => id !== sourceId)
                : [...prev, sourceId]
        );
    };

    const handleDownloadSelected = () => {
        const selectedReports = selectedSources.map(sourceId => {
            const source = revenueSources.find(s => s.revenue_source_id === sourceId);
            return pdfReports.find(report => report.revenue_source_name === source.revenue_source_name);
        });
        generateMultiplePDFs(selectedReports);
    };
    const isDownloadDisabled = selectedSources.length === 0;

    const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'USD': return '$';
            default: return currencyCode;
        }
    };

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    const handleAmountFilterChange = (value) => {
        setAmountFilterValue(value.value[0]);
    };

    const handleCurrencyToggle = (currency) => {
        setSelectedCurrencies(prev =>
            prev.includes(currency)
                ? prev.filter(c => c !== currency)
                : [...prev, currency]
        );
    };

    // Function to determine the color class based on available amount
    const getColorClass = (amount) => {
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

    return (
        <div className="combined-component-container">
            <div className="combined-component-header">
                <h2>Revenue Sources and Available Balances</h2>
                <div className="header-actions">
                    <SearchInput
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                    />
                    <div className="download-and-filter">
                        <div className="tooltip-container">
                            <button
                                onClick={handleDownloadSelected}
                                className="download-selected-btn"
                                disabled={isDownloadDisabled}
                            >
                                <img src={pdfIcon} alt="PDF Icon" className="pdf-icon" />
                                Download Selected Reports
                                {selectedSources.length > 0 && (
                                    <span className="selected-count">{selectedSources.length}</span>
                                )}
                            </button>
                            <div className="tooltip">
                                Please select at least one Revenue Source to download.
                            </div>
                        </div>
                        <div className="filter-wrapper">
                            <button className="filter-button" onClick={toggleFilter}>
                                <img src={filterIcon} alt="Filter Icon" className="filter-icon" />
                            </button>
                            {showFilter && isDataLoaded && (
                                <div className="filter-container" ref={filterRef}>
                                    <div className="filter-card">
                                        <h3>Filter by Available Amount</h3>
                                        <div className="slider-container">
                                            <Slider.Root
                                                defaultValue={[0, maxAmount]}
                                                min={minAmount}
                                                max={maxAmount}
                                                onValueChange={handleAmountFilterChange}
                                                aria-label="Volume"
                                            >
                                                <Slider.Control>
                                                    <Slider.Track>
                                                        <Slider.Range />
                                                    </Slider.Track>
                                                    <Slider.Thumb index={0}>
                                                        <Slider.HiddenInput />
                                                        <span className="slider-value-label">{amountFilterValue}</span>
                                                    </Slider.Thumb>
                                                </Slider.Control>
                                            </Slider.Root>
                                            <div className="slider-values">
                                                <span>{minAmount}</span>
                                                <span>{maxAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filter-card">
                                        <h3>Filter by Currency</h3>
                                        <div className="currency-filter-grid">
                                            {availableCurrencies.map(currency => (
                                                <button
                                                    key={currency}
                                                    className={`currency-button ${selectedCurrencies.includes(currency) ? 'selected' : ''}`}
                                                    onClick={() => handleCurrencyToggle(currency)}
                                                >
                                                    {currency}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="combined-component-grid">
                {filteredSources.map((source, index) => {
                    const balance = filteredBalances.find(bal => bal.revenue_source_name === source.revenue_source_name);
                    const hasBalance = balance !== undefined;
                    const isSelected = selectedSources.includes(source.revenue_source_id);

                    return (
                        <div
                            key={source.revenue_source_id}
                            className={`combined-component-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleCardClick(source.revenue_source_id)}
                            ref={el => (cardRefs.current[index] = el)}
                        >
                            {isSelected && <img src={pdfIcon} alt="PDF Icon" className="card-pdf-icon" />}
                            <h3>{source.revenue_source_name}</h3>
                            {balance ? (
                                <>
                                    <p className="available-amount-label">Available Amount</p>
                                    <p className={`available-amount-value ${getColorClass(balance.availableamount)}`}>
                                        {getCurrencySymbol(balance.currency_code)}{balance.availableamount}
                                    </p>
                                </>
                            ) : (
                                <p>No available amount</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CombinedComponent;
