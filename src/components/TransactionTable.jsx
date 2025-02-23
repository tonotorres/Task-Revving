 // src/components/TransactionTable.jsx
 import React, { useState, useEffect, useRef } from 'react';
 import './TransactionTable.css';
 import transactionsData from '../assets/data/transactions';
 import { Pagination } from '@ark-ui/react/pagination';
 import Sortable from 'sortablejs';
 
 function TransactionTable() {
     const [transactions, setTransactions] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const pageSize = 10;
     const totalTransactions = transactionsData.length;
     const totalPages = Math.ceil(totalTransactions / pageSize);
     const maxVisiblePages = 8;
 
     const tableRef = useRef(null); // Creamos una referencia a la tabla
 
     useEffect(() => {
         const fetchData = async () => {
             await new Promise(resolve => setTimeout(resolve, 500));
             const startIndex = (currentPage - 1) * pageSize;
             const endIndex = startIndex + pageSize;
             const paginatedTransactions = transactionsData.slice(startIndex, endIndex);
             setTransactions(paginatedTransactions);
         };
 
         fetchData();
     }, [currentPage]);
 
     useEffect(() => {
         // Llamamos a la función makeTableDraggable después de que el componente se monte
         if (tableRef.current) {
             makeTableDraggable(tableRef);
         }
     }, [transactions]); // Dependencia en transactions para que se vuelva a ejecutar si cambian los datos
 
     const handlePageChange = (details) => {
         setCurrentPage(details.page);
     };
 
     const handleEllipsisClick = (direction) => {
         if (direction === 'prev') {
             setCurrentPage(Math.max(1, currentPage - 10));
         } else if (direction === 'next') {
             setCurrentPage(Math.min(totalPages, currentPage + 10));
         }
     };
 
     const getVisiblePageNumbers = () => {
         let pages = [];
         if (totalPages <= maxVisiblePages) {
             // Si hay menos o igual que maxVisiblePages páginas, mostrar todas
             for (let i = 1; i <= totalPages; i++) {
                 pages.push(i);
             }
         } else {
             // Siempre mostrar la primera página
             pages.push(1);
 
             if (currentPage <= 3) {
                 // Si estamos en las primeras 3 páginas
                 for (let i = 2; i <= 5; i++) {
                     pages.push(i);
                 }
                 pages.push('+10');
             } else if (currentPage >= totalPages - 2) {
                 // Si estamos en las últimas 3 páginas
                 pages.push('-10');
                 for (let i = totalPages - 4; i < totalPages; i++) {
                     pages.push(i);
                 }
             } else {
                 // En cualquier otra página
                 pages.push('-10');
                 for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                     pages.push(i);
                 }
                 pages.push('+10');
             }
 
             // Siempre mostrar la última página
             pages.push(totalPages);
         }
         return pages;
     };
 
     function makeTableDraggable(tableRef) {
         if (!tableRef.current) return;
 
         const thead = tableRef.current.querySelector('thead');
         const tbody = tableRef.current.querySelector('tbody');
 
         if (!thead) return;
 
         // Hacer que los encabezados sean arrastrables
         const headerRow = thead.querySelector('tr');
 
         Sortable.create(headerRow, {
             animation: 150,
             ghostClass: 'transactionTableGhost', // This line has changed
             onEnd: (event) => {
                 const oldIndex = event.oldIndex;
                 const newIndex = event.newIndex;
 
                 // Reordenar las columnas en el cuerpo de la tabla
                 reorderTableColumns(tbody, oldIndex, newIndex);
             },
         });
     }
 
     function reorderTableColumns(tbody, oldIndex, newIndex) {
         const rows = Array.from(tbody.querySelectorAll('tr'));
 
         rows.forEach((row) => {
             const cells = Array.from(row.children);
             const movedCell = cells.splice(oldIndex, 1)[0]; // Extraer la celda movida
             cells.splice(newIndex, 0, movedCell); // Insertar en la nueva posición
 
             // Actualizar el DOM con el nuevo orden
             row.innerHTML = '';
             cells.forEach((cell) => row.appendChild(cell));
         });
     }
 
     return (
         <div className="transaction-table-ark-table-container">
             <div className="transaction-table-pagination-container">
                 <Pagination.Root
                     count={totalTransactions}
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
         </div>
     );
 }
 
 export default TransactionTable;
 