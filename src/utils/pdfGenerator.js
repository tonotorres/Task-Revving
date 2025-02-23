import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateMultiplePDFs = (reports) => {
  const doc = new jsPDF();
  
  reports.forEach((report, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    doc.setFontSize(18);
    doc.text(`Revenue Source Report: ${report.revenue_source_name}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Customer: ${report.customer_name}`, 14, 30);
    
    const tableColumn = ["Month", "Currency", "Amount"];
    const tableRows = report.month_info.map(info => [
      info.month,
      info.currency_code,
      info.sum.toLocaleString()
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });
  });
  
  doc.save(`revenue_source_reports.pdf`);
};
