import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TransactionTable.css';
import transactionsData from '../assets/data/transactions';
import { Pagination } from '@ark-ui/react/pagination';
import Sortable from 'sortablejs';
import SearchInput from './SearchInput';
import DatePickerComponent from './DatePickerComponent';
import TransactionChart from './TransactionChart'; // Import the TransactionChart component

function TransactionTable() {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null }); // New state for date range
    const [showChart, setShowChart] = useState(false); // New state to toggle chart visibility
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const pageSize = 10;
    const tableRef = useRef(null);

    // Función para convertir dd-mm-yyyy a yyyy-mm-dd
    const convertDateFormat = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    const filterTransactions = useCallback((data) => {
        return data.filter(transaction => {
            const searchTermMatch = Object.values(transaction).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Convertir la fecha de la transacción al formato yyyy-mm-dd antes de crear el objeto Date
            const transactionDate = new Date(convertDateFormat(transaction.transactiondate));
            const startDate = selectedDateRange.start ? new Date(convertDateFormat(selectedDateRange.start)) : null;
            const endDate = selectedDateRange.end ? new Date(convertDateFormat(selectedDateRange.end)) : null;

            const dateRangeMatch = (!startDate || transactionDate >= startDate) &&
                                   (!endDate || transactionDate <= endDate);

            return searchTermMatch && dateRangeMatch;
        });
    }, [searchTerm, selectedDateRange]);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const filtered = filterTransactions(transactionsData);
            setFilteredTransactions(filtered);
            const totalFilteredTransactions = filtered.length;
            const totalPages = Math.ceil(totalFilteredTransactions / pageSize);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedTransactions = filtered.slice(startIndex, endIndex);
            setTransactions(paginatedTransactions);
        };

        fetchData();
    }, [currentPage, searchTerm, filterTransactions]); // Depend on filterTransactions

    useEffect(() => {
        if (tableRef.current) {
            makeTableDraggable(tableRef);
        }
    }, [transactions]);

    const handlePageChange = (details) => {
        setCurrentPage(details.page);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleDateRangeChange = useCallback((dates) => {
        setSelectedDateRange({ start: dates[0], end: dates[1] });
        setCurrentPage(1); // Reset to first page when date range changes
    }, []); // The handleDateRangeChange function is memoized

    const handleEllipsisClick = useCallback((direction) => {
        const filteredData = filterTransactions(transactionsData);
        const totalFilteredTransactions = filteredData.length;
        const totalPages = Math.ceil(totalFilteredTransactions / pageSize);
        if (direction === 'prev') {
            setCurrentPage(Math.max(1, currentPage - 10));
        } else if (direction === 'next') {
            setCurrentPage(Math.min(totalPages, currentPage + 10));
        }
    }, [filterTransactions]);

    const getVisiblePageNumbers = useCallback(() => {
        const filteredData = filterTransactions(transactionsData);
        const totalFilteredTransactions = filteredData.length;
        const totalPages = Math.ceil(totalFilteredTransactions / pageSize);
        const maxVisiblePages = 8;
        let pages = [];
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage <= 3) {
                for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('+10');
            } else if (currentPage >= totalPages - 2) {
                pages.push('-10');
                for (let i = totalPages - 4; i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push('-10');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('+10');
            }
            pages.push(totalPages);
        }
        return pages;
    }, [filterTransactions, currentPage]);

    function makeTableDraggable(tableRef) {
        if (!tableRef.current) return;

        const thead = tableRef.current.querySelector('thead');
        const tbody = tableRef.current.querySelector('tbody');

        if (!thead) return;

        const headerRow = thead.querySelector('tr');

        Sortable.create(headerRow, {
            animation: 150,
            ghostClass: 'transactionTableGhost',
            onEnd: (event) => {
                const oldIndex = event.oldIndex;
                const newIndex = event.newIndex;
                reorderTableColumns(tbody, oldIndex, newIndex);
            },
        });
    }

    function reorderTableColumns(tbody, oldIndex, newIndex) {
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.forEach((row) => {
            const cells = Array.from(row.children);
            const movedCell = cells.splice(oldIndex, 1)[0];
            cells.splice(newIndex, 0, movedCell);

            row.innerHTML = '';
            cells.forEach((cell) => row.appendChild(cell));
        });
    }

    const toggleChartVisibility = () => {
        setShowChart(!showChart);
    };

    return (
        <div className="transaction-table-ark-table-container">
            <div className="transaction-table-controls">
                <button onClick={toggleChartVisibility} className="toggle-chart-button">
                    {showChart ? 'Show Table' : 'Show Chart'}
                </button>
                <div className="transaction-table-search">
                    <SearchInput
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                    />
                </div>
                <div className="transaction-table-pagination-container">
                    <Pagination.Root
                        count={filterTransactions(transactionsData).length}
                        pageSize={pageSize}
                        page={currentPage}
                        onPageChange={handlePageChange}
                    >
                        <Pagination.PrevTrigger>
                            Anterior
                        </Pagination.PrevTrigger>
                        {getVisiblePageNumbers().map((page, index) =>
                            page === '-10' || page === '+10' ? (
                                <button
                                    key={`ellipsis-${index}`}
                                    className="transaction-table-ellipsis-button"
                                    onClick={() => handleEllipsisClick(page === '-10' ? 'prev' : 'next')}
                                >
                                    {page}
                                </button>
                            ) : (
                                <Pagination.Item key={page} value={page}>
                                    {page}
                                </Pagination.Item>
                            )
                        )}
                        <Pagination.NextTrigger>
                            Siguiente
                        </Pagination.NextTrigger>
                    </Pagination.Root>
                </div>
                <div className="transaction-table-datepicker">
                    <DatePickerComponent onDateRangeChange={handleDateRangeChange} />
                </div>
            </div>
            {showChart ? (
                <TransactionChart filteredTransactions={filteredTransactions} />
            ) : (
                <table className="transaction-table-ark-table" ref={tableRef}>
                    <thead>
                        <tr>
                            <th className="transaction-table-ark-table-header">ID</th>
                            <th className="transaction-table-ark-table-header">Customer Name</th>
                            <th className="transaction-table-ark-table-header">Revenue Source</th>
                            <th className="transaction-table-ark-table-header">Currency Code</th>
                            <th className="transaction-table-ark-table-header">Transaction Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id} className="transaction-table-ark-table-row">
                                <td className="transaction-table-ark-table-cell">{transaction.id}</td>
                                <td className="transaction-table-ark-table-cell">{transaction.customername}</td>
                                <td className="transaction-table-ark-table-cell">{transaction.revenuesourcename}</td>
                                <td className="transaction-table-ark-table-cell">{transaction.currencycode}</td>
                                <td className="transaction-table-ark-table-cell">{transaction.transactiondate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TransactionTable;
