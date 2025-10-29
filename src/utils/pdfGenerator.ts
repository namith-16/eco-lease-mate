import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LeaseCalculatorInputs, LeaseCalculatorOutputs } from '@/hooks/useLeaseCalculator';

export const generatePDF = async (
  inputs: LeaseCalculatorInputs,
  outputs: LeaseCalculatorOutputs
) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Header with EcoScoot branding
  pdf.setFillColor(16, 185, 129); // Primary green
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EcoScoot', margin, 20);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Lease Quote', margin, 30);

  yPosition = 55;

  // Customer Information Section
  pdf.setTextColor(31, 41, 55); // Charcoal
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Customer Information', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Name: _______________________________', margin, yPosition);
  yPosition += 8;
  pdf.text('Phone: _______________________________', margin, yPosition);
  yPosition += 8;
  pdf.text('Email: _______________________________', margin, yPosition);
  yPosition += 15;

  // Lease Details Section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Lease Details', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const details = [
    ['Lease Duration:', `${inputs.months} months`],
    ['Monthly Base Price:', `₹${inputs.monthlyPrice.toLocaleString('en-IN')}`],
    ['Trade-in Credit:', inputs.tradeInCredit > 0 ? `₹${inputs.tradeInCredit.toLocaleString('en-IN')}` : 'None'],
    ['Security Deposit:', inputs.deposit > 0 ? `₹${inputs.deposit.toLocaleString('en-IN')}` : 'None'],
    ['Extended Maintenance:', inputs.maintenanceAddOn ? 'Yes (₹499/month)' : 'No'],
    ['Promo Code:', inputs.promoCode || 'None'],
    ['Tax Rate:', `${(inputs.taxRate * 100).toFixed(2)}%`],
  ];

  details.forEach(([label, value]) => {
    pdf.text(label, margin, yPosition);
    pdf.text(value, margin + 70, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Cost Breakdown Section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Cost Breakdown', margin, yPosition);
  yPosition += 10;

  // Table header
  pdf.setFillColor(16, 185, 129);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Item', margin + 5, yPosition + 2);
  pdf.text('Amount', pageWidth - margin - 40, yPosition + 2);
  yPosition += 12;

  // Table rows
  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'normal');
  
  const costItems = [
    ['Base Total', outputs.total],
    ['Promo Discount', -outputs.promoDiscount],
    ['Total Tax (GST)', outputs.totalTax],
    ['Trade-in Credit', -inputs.tradeInCredit],
  ];

  costItems.forEach(([label, amount]) => {
    const numAmount = amount as number;
    if (numAmount !== 0) {
      pdf.text(label as string, margin + 5, yPosition);
      const amountText = numAmount > 0 
        ? `₹${numAmount.toLocaleString('en-IN')}`
        : `-₹${Math.abs(numAmount).toLocaleString('en-IN')}`;
      pdf.text(amountText, pageWidth - margin - 5, yPosition, { align: 'right' });
      yPosition += 7;
    }
  });

  // Total section
  yPosition += 5;
  pdf.setFillColor(242, 242, 242);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Net Total', margin + 5, yPosition + 2);
  pdf.text(`₹${outputs.netTotal.toLocaleString('en-IN')}`, pageWidth - margin - 5, yPosition + 2, { align: 'right' });
  yPosition += 15;

  // Payment Details
  pdf.setFillColor(220, 252, 231);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(16, 185, 129);
  yPosition += 8;
  pdf.text('Upfront Payment:', margin + 5, yPosition);
  pdf.text(`₹${outputs.upfrontDue.toLocaleString('en-IN')}`, pageWidth - margin - 5, yPosition, { align: 'right' });
  yPosition += 8;
  pdf.text('Monthly Payment:', margin + 5, yPosition);
  pdf.text(`₹${outputs.monthlyDue.toLocaleString('en-IN')}`, pageWidth - margin - 5, yPosition, { align: 'right' });
  yPosition += 15;

  // What's Included Section
  pdf.setTextColor(31, 41, 55);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text("What's Included", margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const included = [
    '✓ Maintenance & insurance handled',
    '✓ 24/7 roadside assistance',
    '✓ Battery warranty: 3 years / 50,000 km',
    '✓ Trade-in credit applied',
    '✓ Flexible upgrade options',
  ];

  included.forEach(item => {
    pdf.text(item, margin, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Terms & Conditions
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  const terms = [
    'Terms & Conditions: This quote is valid for 30 days. Prices subject to change. Subject to credit approval.',
    'All maintenance and insurance costs are included in the monthly payment. Battery warranty can be extended.',
    'Early termination fees may apply. Please refer to the complete lease agreement for full terms.',
  ];
  
  terms.forEach(term => {
    const lines = pdf.splitTextToSize(term, pageWidth - 2 * margin);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 4;
  });

  yPosition += 10;

  // Signature Section
  pdf.setFontSize(10);
  pdf.setTextColor(31, 41, 55);
  pdf.text('Customer Signature: _______________________', margin, yPosition);
  pdf.text('Date: ___________', pageWidth - margin - 50, yPosition);
  yPosition += 10;

  // Footer
  pdf.setFillColor(16, 185, 129);
  pdf.rect(0, pdf.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.text('EcoScoot | Zero up-front leasing | Call: +91 1800 XXX XXXX', pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const filename = `ecoscoot_lease_quote_${date}.pdf`;

  // Save the PDF
  pdf.save(filename);
};
