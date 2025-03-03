import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import TransactionTable from './components/TransactionTable';
import RevenueSources from './components/RevenueSources';
import { Tabs } from '@ark-ui/react/tabs';
import './App.css';

function App() {
    const [exchangeRates, setExchangeRates] = useState({});
    const currencies = ['EUR', 'GBP', 'USD'];
    const apiKey = process.env.REACT_APP_API_KEY; // Usa la variable de entorno

    useEffect(() => {
        async function fetchExchangeRates() {
            try {
                const response = await fetch(
                    `https://api.apilayer.com/exchangerates_data/latest?symbols=${currencies.join(',')}&base=EUR`,
                    {
                        method: 'GET',
                        headers: {
                            apikey: apiKey,
                        },
                    }
                );
    
                const data = await response.json();
                console.log('API Response Data:', data);
    
                if (data.success) {
                    const rates = {};
                    for (const fromCurrency of currencies) {
                        for (const toCurrency of currencies) {
                            if (fromCurrency !== toCurrency) {
                                const key = `${fromCurrency}_${toCurrency}`;
                                if (data.rates && data.rates[toCurrency]) {
                                    const rate = data.rates[toCurrency] / data.rates[fromCurrency];
                                    rates[key] = rate;
                                } else {
                                    console.warn(`Tipo de cambio no encontrado para ${key}`);
                                }
                            }
                        }
                    }
                    setExchangeRates(rates);
                    console.log('Tipos de cambio obtenidos:', rates);
                } else {
                    console.error('Error al obtener los tipos de cambio:', data);
                }
            } catch (error) {
                console.error('Error en la llamada a la API:', error);
            }
        }
    
        fetchExchangeRates();
    }, []);
    

    return (
        <ThemeProvider>
            <div className="App">
                <Header />
                <div className="tabs-container">
                    <Tabs.Root defaultValue="transactions">
                        <Tabs.List className="tabs-list">
                            <Tabs.Trigger className="tabs-trigger" value="transactions">
                                Transactions
                            </Tabs.Trigger>
                            <Tabs.Trigger className="tabs-trigger" value="revenueSources">
                                Revenues
                            </Tabs.Trigger>
                        </Tabs.List>

                        <div className="tabs-content-wrapper">
                            <Tabs.Content className="tabs-content" value="transactions">
                                <TransactionTable exchangeRates={exchangeRates} />
                            </Tabs.Content>
                            <Tabs.Content className="tabs-content" value="revenueSources">
                                <RevenueSources exchangeRates={exchangeRates} />
                            </Tabs.Content>
                        </div>
                    </Tabs.Root>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
