import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Feedback, DashboardStats, RatingDistribution } from './api';

// CSV Export
export const exportToCSV = (feedback: Feedback[], filename?: string) => {
  if (feedback.length === 0) {
    alert('No data to export');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Name', 'Location', 'Rating', 'Type', 'Feedback'];

  // Convert feedback to CSV rows
  const rows = feedback.map((item) => [
    format(new Date(item.created_at), 'yyyy-MM-dd HH:mm:ss'),
    item.name || 'Anonymous',
    item.location || 'Unknown',
    item.rating.toString(),
    item.rating_type,
    item.feedback ? `"${item.feedback.replace(/"/g, '""')}"` : '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    filename || `feedback-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// PDF Export with Branding and Charts
export const exportToPDF = async (
  feedback: Feedback[],
  stats: DashboardStats | null,
  ratingDist: RatingDistribution[],
  chartElements: { lineChart?: HTMLElement; barChart?: HTMLElement },
  filename?: string
) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // ===== HEADER WITH BRANDING =====
  // African Joy Dairy branding colors
  doc.setFillColor(55, 117, 54); // Primary green
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Add milk bottle icon (simplified)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 10, 8, 12, 1, 1, 'F');
  doc.rect(16.5, 8, 5, 3, 'F');
  doc.setFillColor(55, 117, 54);
  doc.rect(16, 18, 6, 4, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('African Joy Dairy', 30, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Customer Feedback Analytics Report', 30, 28);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'PPP')}`, 30, 34);

  yPos = 50;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // ===== STATISTICS SUMMARY =====
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 117, 54);
  doc.text('Summary Statistics', 14, yPos);
  yPos += 10;

  if (stats) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const statsData = [
      ['Total Reviews', stats.total_reviews.toString()],
      ['Average Rating', `${stats.average_rating.toFixed(2)} / 5.0`],
      ['5-Star Reviews', `${stats.five_star_percentage.toFixed(0)}%`],
      [
        'Trend',
        `${stats.trend >= 0 ? '+' : ''}${stats.trend.toFixed(1)}%`,
      ],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'grid',
      headStyles: {
        fillColor: [55, 117, 54],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 11,
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // ===== RATING DISTRIBUTION =====
  if (ratingDist.length > 0) {
    // Check if we need a new page
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 117, 54);
    doc.text('Rating Distribution', 14, yPos);
    yPos += 10;

    const distData = ratingDist.map((item) => [
      `${item.rating} Star${item.rating > 1 ? 's' : ''}`,
      item.count.toString(),
      `${((item.count / stats!.total_reviews) * 100).toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Rating', 'Count', 'Percentage']],
      body: distData,
      theme: 'grid',
      headStyles: {
        fillColor: [55, 117, 54],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 11,
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // ===== CHARTS (if available) =====
  if (chartElements.barChart || chartElements.lineChart) {
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 117, 54);
    doc.text('Visual Analytics', 14, yPos);
    yPos += 10;

    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default;

    // Add bar chart
    if (chartElements.barChart) {
      try {
        const canvas = await html2canvas(chartElements.barChart, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.text('Rating Distribution Chart', 14, yPos);
        yPos += 5;
        doc.addImage(imgData, 'PNG', 14, yPos, imgWidth, Math.min(imgHeight, 80));
        yPos += Math.min(imgHeight, 80) + 15;
      } catch (error) {
        console.error('Error adding bar chart to PDF:', error);
      }
    }

    // Add line chart
    if (chartElements.lineChart) {
      if (yPos > pageHeight - 100) {
        doc.addPage();
        yPos = 20;
      }

      try {
        const canvas = await html2canvas(chartElements.lineChart, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.text('Rating Trend Chart', 14, yPos);
        yPos += 5;
        doc.addImage(imgData, 'PNG', 14, yPos, imgWidth, Math.min(imgHeight, 80));
        yPos += Math.min(imgHeight, 80) + 15;
      } catch (error) {
        console.error('Error adding line chart to PDF:', error);
      }
    }
  }

  // ===== DETAILED FEEDBACK =====
  if (feedback.length > 0) {
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 117, 54);
    doc.text('Detailed Feedback', 14, yPos);
    yPos += 10;

    const feedbackData = feedback.map((item) => [
      format(new Date(item.created_at), 'MMM dd, yyyy'),
      item.name || 'Anonymous',
      item.location || 'N/A',
      item.rating.toString(),
      item.feedback || 'No comment',
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Date', 'Name', 'Location', 'Rating', 'Feedback']],
      body: feedbackData,
      theme: 'grid',
      headStyles: {
        fillColor: [55, 117, 54],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        4: { cellWidth: 60 }, // Feedback column wider
      },
      margin: { left: 14, right: 14 },
    });
  }

  // ===== FOOTER ON ALL PAGES =====
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `African Joy Dairy - Confidential Report`,
      14,
      pageHeight - 10
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 35,
      pageHeight - 10
    );
  }

  // Save the PDF
  doc.save(
    filename || `feedback-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
  );
};
