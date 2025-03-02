import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateMultiplePDFs = (reports, exchangeRates, targetCurrency = 'EUR') => {
  console.log('Reports received:', reports);
  console.log('Exchange rates received:', exchangeRates);
  console.log('Target currency:', targetCurrency);

  const doc = new jsPDF();
  
  reports.forEach((report, index) => {
    console.log(`Processing report ${index + 1}:`, report);

    if (index > 0) {
      doc.addPage();
    }
    
    doc.setFontSize(18);
    doc.text(`Revenue Source Report: ${report.revenue_source_name}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Customer: ${report.customer_name}`, 14, 30);
    
    const tableColumn = ["Month", "Original Currency", "Original Amount", `Amount in ${targetCurrency}`];
    const tableRows = report.month_info.map(info => {
      console.log('Processing month info:', info);
      let amountInTargetCurrency = info.sum;
      if (info.currency_code !== targetCurrency) {
          const exchangeRate = exchangeRates[`${info.currency_code}_${targetCurrency}`];
          console.log(`Exchange rate for ${info.currency_code} to ${targetCurrency}:`, exchangeRate);

          if (exchangeRate) {
              amountInTargetCurrency = info.sum * exchangeRate;
          } else {
              console.warn(`No exchange rate found for ${info.currency_code} to ${targetCurrency}`);
              amountInTargetCurrency = 'N/A'; // Indica que no hay tasa de cambio disponible
          }
      }
      
      // Formatea la fecha
      const dateParts = info.month.split('-');
      const formattedDate = `${dateParts[1]}-${dateParts[0]}`;
      
      return [
        formattedDate,
        info.currency_code,
        info.sum.toLocaleString(),
        typeof amountInTargetCurrency === 'number' ?
            amountInTargetCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
            amountInTargetCurrency // Muestra 'N/A' si no hay tasa de cambio
      ];
    });
    
    console.log('Table rows:', tableRows);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });
  });
  
  doc.save(`revenue_source_reports.pdf`);
};
