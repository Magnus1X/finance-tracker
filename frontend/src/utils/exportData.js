import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const exportToCSV = (transactions, budgets) => {
    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";

    // Transactions Section
    csvContent += "--- TRANSACTIONS ---\n";
    csvContent += "Date,Type,Category,Amount,Description\n";
    (transactions || []).forEach(t => {
        const date = t.date ? format(new Date(t.date), 'yyyy-MM-dd') : 'N/A';
        const type = t.type || 'N/A';
        const category = t.category || 'Uncategorized';
        const amount = t.amount || 0;
        const desc = (t.description || '').replace(/,/g, ''); // prevent csv breaks
        csvContent += `${date},${type},${category},${amount},${desc}\n`;
    });

    csvContent += "\n--- BUDGETS ---\n";
    csvContent += "Category,Amount,Spent,Remaining\n";
    (budgets || []).forEach(b => {
        const category = b.category || 'N/A';
        const amount = b.amount || 0;
        const spent = b.spent || 0;
        const remaining = amount - spent;
        csvContent += `${category},${amount},${spent},${remaining}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = (transactions, budgets, user) => {
    const doc = new jsPDF();
    const userName = user?.name || 'User';

    // Title
    doc.setFontSize(22);
    doc.setTextColor(15, 118, 110); // emerald-700
    doc.text('FinanceEra Complete Report', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${userName}`, 14, 30);
    doc.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 36);

    // Budgets Table
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Budget Overview', 14, 50);

    const budgetData = (budgets || []).map(b => [
        b.category || 'N/A',
        `$${(b.amount || 0).toFixed(2)}`,
        `$${(b.spent || 0).toFixed(2)}`,
        `$${((b.amount || 0) - (b.spent || 0)).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 55,
        head: [['Category', 'Budget Amount', 'Spent', 'Remaining']],
        body: budgetData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, // emerald-500
    });

    // Transactions Table
    const finalY = doc.lastAutoTable?.finalY || 55;
    doc.setFontSize(16);
    doc.text('Recent Transactions', 14, finalY + 15);

    const transactionData = (transactions || []).map(t => [
        t.date ? format(new Date(t.date), 'yyyy-MM-dd') : 'N/A',
        t.type ? String(t.type).toUpperCase() : 'N/A',
        t.category || 'Uncategorized',
        `$${(parseFloat(t.amount) || 0).toFixed(2)}`,
        t.description || ''
    ]);

    autoTable(doc, {
        startY: finalY + 20,
        head: [['Date', 'Type', 'Category', 'Amount', 'Description']],
        body: transactionData,
        theme: 'grid',
        headStyles: { fillColor: [15, 118, 110] }, // emerald-700
        alternateRowStyles: { fillColor: [240, 253, 244] }, // emerald-50
    });

    // Save the PDF
    doc.save(`finance_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
