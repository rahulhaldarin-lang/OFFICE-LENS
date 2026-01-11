
import { InventoryEntry } from '../types';

export const exportService = {
  exportToCSV: (entries: InventoryEntry[], filename: string = 'precision_export'): void => {
    // Sort entries by invoiceNumber (ID number) ascending using natural sort
    const sortedEntries = [...entries].sort((a, b) => 
      a.invoiceNumber.localeCompare(b.invoiceNumber, undefined, { numeric: true, sensitivity: 'base' })
    );

    const headers = ['Date', 'Category', 'Invoice No', 'Quantity (Units)', 'Pairs', 'Weight (gm)', 'User ID', 'Unique Entry ID', 'Timestamp'];
    const rows = sortedEntries.map(e => [
      e.date,
      e.itemType,
      e.invoiceNumber,
      e.quantity,
      e.pairs,
      e.weight.toFixed(3),
      e.userId,
      e.id,
      new Date(e.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
