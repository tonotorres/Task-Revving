// src/App.jsx
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
    // const apiKey = 'GeAHwcpum5CWAZICOmJ4G33XdO4WPCVD'; 
    const apiKey = ''; 

    useEffect(() => {
        async function fetchExchangeRates() {
            try {
                const response = await fetch(
                    `https://api.apilayer.com/exchangerates_data/latest?symbols=${currencies.join(',')}&base=USD`,
                    {
                        method: 'GET',
                        headers: {
                            apikey: apiKey,
                        },
                    }
                );

                const data = await response.json();

                if (data.success) {
                    // Estructura los tipos de cambio en el formato que necesitas
                    const rates = {};
                    for (const fromCurrency of currencies) {
                        for (const toCurrency of currencies) {
                            if (fromCurrency !== toCurrency) {
                                if (fromCurrency === 'USD') {
                                    rates[`${fromCurrency}_${toCurrency}`] = data.rates[toCurrency];
                                } else {
                                    // Necesitas un paso adicional para calcular el tipo de cambio
                                    // si la moneda base no es USD
                                    const rateFromUSD = data.rates[fromCurrency];
                                    const rateToUSD = data.rates[toCurrency];
                                    rates[`${fromCurrency}_${toCurrency}`] = rateToUSD / rateFromUSD;
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
                                Transacciones
                            </Tabs.Trigger>
                            <Tabs.Trigger className="tabs-trigger" value="revenueSources">
                                Fuentes de Ingresos
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
