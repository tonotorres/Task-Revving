import React, { useState, useMemo, useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';
import transactionsAmount from '../assets/data/transactionsAmount';
import revenueSources from '../assets/data/revenueSources';
import './TransactionChart.css';

const TransactionChart = ({ filteredTransactions }) => {

    const [hiddenRevenueSources, setHiddenRevenueSources] = useState([]);

    const revenueSourceColors = useMemo(() => {
        const colors = {};
        revenueSources.forEach((rs, index) => {
            colors[rs.revenue_source_name] = `hsl(${index * 360 / revenueSources.length}, 70%, 50%)`;
        });
        return colors;
    }, [revenueSources]);

    const data = useMemo(() => {
        const groupedData = {};

        filteredTransactions.forEach(transaction => {
            const { revenuesourcename, transactiondate, amount } = transaction;

            if (!groupedData[revenuesourcename]) {
                groupedData[revenuesourcename] = {};
            }
            if (!groupedData[revenuesourcename][transactiondate]) {
                groupedData[revenuesourcename][transactiondate] = 0;
            }
        });

        return Object.entries(groupedData)
            .map(([revenuesource, dateCounts]) => ({
                id: revenuesource,
                color: revenueSourceColors[revenuesource],
                data: Object.entries(dateCounts)
                    .filter(([date]) => {
                        return filteredTransactions.some(t =>
                            t.revenuesourcename === revenuesource &&
                            t.transactiondate === date 
                        );
                    })
                    .map(([date]) => {
                        const transaction = transactionsAmount.find(t => t.revenuesourcename === revenuesource && t.transactiondate === date);
                        const amount = transaction ? transaction.amount : 0;
                        return {
                            x: new Date(date),
                            y: amount,
                        };
                    })
                    .sort((a, b) => a.x - b.x),
            }))
            .filter(series => series.data.length > 0 && !hiddenRevenueSources.includes(series.id));
    }, [filteredTransactions, hiddenRevenueSources, revenueSourceColors]);

    const theme = {
        axis: {
            textColor: '#4C4C4C',
            fontSize: '10px',
            tickColor: '#DDDDDD',
        },
        grid: {
            lineColor: '#DDDDDD'
        }
    };

    const handleLegendClick = useCallback((revenueSource) => {
        setHiddenRevenueSources(prev =>
            prev.includes(revenueSource)
                ? prev.filter(source => source !== revenueSource)
                : [...prev, revenueSource]
        );
    }, []);

    const legendData = useMemo(() => {
        return revenueSources.map(rs => ({
            id: rs.revenue_source_name,
            label: rs.revenue_source_name,
            color: revenueSourceColors[rs.revenue_source_name]
        }));
    }, [revenueSourceColors, revenueSources]);

    return (
        <div className="transaction-chart-container">
            <div className="transaction-chart-header">
                <h2 className="transaction-chart-title">Transaction Chart</h2>
            </div>
            <div className="transaction-chart">
                <div className="chart-legend-container">
                    <ResponsiveLine
                        data={data}
                        margin={{ top: 50, right: 20, bottom: 80, left: 60 }} // Reducir el margen derecho para la leyenda
                        xScale={{
                            type: 'time',
                            format: '%Y-%m-%d',
                            precision: 'day',
                            useUTC: false
                        }}
                        xFormat="time:%Y-%m-%d"
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: false,
                            reverse: false
                        }}
                        axisBottom={{
                            format: '%b %d',
                            tickValues: 'every 7 days',
                            legend: 'Date',
                            legendOffset: 60,
                            legendPosition: 'middle',
                            tickRotation: -45,
                            tickSize: 5,
                            tickPadding: 5
                        }}
                        axisLeft={{
                            legend: 'Transaction Amount',
                            legendOffset: -40,
                            legendPosition: 'middle'
                        }}
                        pointSize={6}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        useMesh={true}
                        theme={theme}
                        colors={({ id }) => revenueSourceColors[id]}
                        tooltip={({ point }) => (
                            <div className="tooltip">
                                <div><span className="tooltip-label">Revenue Source:</span> <span className="tooltip-value">{point.serieId}</span></div>
                                <div><span className="tooltip-label">Date:</span> <span className="tooltip-value">{new Date(point.data.x).toLocaleDateString()}</span></div>
                                <div><span className="tooltip-label">Amount:</span> <span className="tooltip-value">${point.data.y.toFixed(2)}</span></div>
                                <div><span className="tooltip-label">Customer:</span> <span className="tooltip-value">{'All'}</span></div>
                            </div>
                        )}
                    />
                    <div className="custom-legend">
                        {legendData.map(item => (
                            <div
                                key={item.id}
                                className={`legend-item ${hiddenRevenueSources.includes(item.id) ? 'legend-item-hidden' : ''}`}
                                onClick={() => handleLegendClick(item.id)}
                            >
                                <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                                <span className="legend-label">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionChart;
