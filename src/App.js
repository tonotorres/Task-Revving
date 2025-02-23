// src/App.jsx
import React from 'react';
import Header from './components/Header';
import TransactionTable from './components/TransactionTable';
import RevenueSources from './components/RevenueSources';
import { Tabs } from '@ark-ui/react/tabs';
import './App.css';


function App() {
    return (
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
                            <TransactionTable />
                        </Tabs.Content>
                        <Tabs.Content className="tabs-content" value="revenueSources">
                            <RevenueSources />
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>
        </div>
    );
}

export default App;
