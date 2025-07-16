import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "../pages/Dashboard/Invoices/UpdateInvoiceModal";
const rupeeImg = 'data:image/png;base64,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'
export const generateInvoicePDF = (invoiceData: any) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 8;
  const lineSpacing = 6;
  let y = 10;
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setLineWidth(0.5);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // 1. Header (Company Info + Tax Invoice Label)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("MITRA Consultancy Private Limited", marginX, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "No.3 Third Floor, Times Square, 14th Main Rd, 1st Sector,",
    marginX,
    (y += lineSpacing)
  );
  doc.text("HSR Layout,  Bengaluru 560102", marginX, (y += lineSpacing));
  doc.text("India", marginX, (y += lineSpacing));
  doc.text("GSTIN: 29AAVCA9656J1ZY", marginX, (y += lineSpacing));

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TAX INVOICE", pageWidth - marginX, y, { align: "right" });

  // or wherever your last line ends

  // Draw horizontal line from left to right
  doc.setLineWidth(0.5); // Thin line
  doc.line(5, y + 2, doc.internal.pageSize.getWidth() - 5, y + 2);

  // 2. Invoice Info
  y += 8; // Move down after header
  doc.setFontSize(10);
  const metaLeftY = y;
  doc.text(`# : ${invoiceData.customInvoiceId || "INV-XXX"}`, marginX, y);
  doc.text(
    `Date : ${formatDate(invoiceData.createdAt)}`,
    marginX,
    (y += lineSpacing)
  );

  doc.text(`Terms : ${invoiceData.terms}`, marginX, (y += lineSpacing));
  doc.text(
    `Date : ${formatDate(invoiceData.dueDate)}`,
    marginX,
    (y += lineSpacing)
  );

  // Draw vertical line between left and right blocks
  const verticalLineX = pageWidth / 2;
  doc.setLineWidth(0.2);
  doc.line(verticalLineX, metaLeftY - 6, verticalLineX, y + 4); // x, y1, x, y2

  // Right-side text
  const metaRightY = metaLeftY;
  doc.text(
    `Place Of Supply : ${invoiceData.placeOfSupply || ""}`,
    pageWidth - marginX,
    metaRightY,
    { align: "right" }
  );

  doc.setLineWidth(0.5); // Thin line
  doc.line(5, y + 4, doc.internal.pageSize.getWidth() - 5, y + 4);
  y += 10;

  // 3. Bill To & Ship To
  const headerBgColor = { r: 206, g: 203, b: 202 };
  const rowHeight = 8; // Height of the header row
  doc.setFillColor(headerBgColor.r, headerBgColor.g, headerBgColor.b); // Light gray (RGB 230)
  doc.rect(marginX - 2.6, y - 6, pageWidth - 2 * marginX + 5.2, rowHeight, "F"); // full row width

  // Draw section titles on top of gray box
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("Bill To", marginX + 2, y);
  doc.text("Ship To", pageWidth / 2 + 2, y);
  doc.setFont("helvetica", "normal");

  const billTo = invoiceData.billTo?.[0] || {};
  const shipTo = invoiceData.shipTo?.[0] || {};

  const addressSpacing = lineSpacing;

  const formatAddress = (data: any) => [
    data.name || "",
    data.address || "",
    `${data.city || ""}, ${data.state || ""}, ${data.pinCode || ""}`,
    `GSTIN: ${data.gst || ""}`,
  ];

  const billLines = formatAddress(billTo);
  const shipLines = formatAddress(shipTo);
  // Calculate address block height
  const addressBlockHeight = billLines.length * addressSpacing;

  // Draw vertical line (ruler) between Bill To and Ship To
  const addressDividerX = pageWidth / 2; // Center between columns
  const addressStartY = y + addressSpacing;
  const addressEndY = addressStartY + addressBlockHeight - addressSpacing + 2;

  doc.setLineWidth(0.2); // Thin line
  doc.line(
    addressDividerX,
    addressStartY - 12,
    addressDividerX,
    addressEndY + 2
  ); // x, y1, x, y2

  // Draw the addresses
  for (let i = 0; i < billLines.length; i++) {
    const lineY = y + (i + 1) * addressSpacing;
    doc.text(billLines[i], marginX, lineY);
    doc.text(shipLines[i], pageWidth / 2 + 2, lineY);
  }
  // Draw horizontal line after address section
  doc.setLineWidth(0.3); // or 0.2 for thinner
  doc.line(
    5,
    y + billLines.length * addressSpacing + 4,
    pageWidth - 5,
    y + billLines.length * addressSpacing + 4
  );

  doc.setLineWidth(0.3); // Thin line
  doc.line(5, y + 2, doc.internal.pageSize.getWidth() - 5, y + 2);

  y += billLines.length * addressSpacing + 4;

  // 4. Item Table
  autoTable(doc, {
    startY: y,
    head: [
      [
        "#",
        "Item & Description",
        "HSN/SAC",
        "Qty",
        "Rate",
        "IGST %",
        "Amt",
        "Amount",
      ],
    ],
    body: (invoiceData.invoiceItems || []).map((item: any, index: number) => [
      index + 1,
      item.item || "", // item & description
      item.hsn || "", // HSN/SAC
      item.qty || 0, // Qty
      Number(item.rate || 0).toFixed(2), // Rate
      ((invoiceData.igst / invoiceData.subTotal) * 100).toFixed(2), // IGST %
      ((item.amount * invoiceData.igst) / invoiceData.subTotal).toFixed(2), // IGST Amt
      Number(item.amount || 0).toFixed(2), // Total
    ]),

    margin: { left: marginX - 3, right: marginX - 3 },
    styles: {
      fontSize: 9,
      lineWidth: 0.1, // Ensure border lines
      lineColor: 0, // Black lines
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [206, 203, 202],
      textColor: 0,
      lineWidth: 0.1,
      lineColor: 0,
    },
    bodyStyles: {
      lineWidth: 0.1,
      lineColor: 0,
    },
  });

  const tableEndY = (doc as any).lastAutoTable.finalY;

  let rightY = tableEndY + 10;

  const alignRightSection = (
  label: string,
  value: string | number,
  isBold = false
) => {
  if (isBold) {
    doc.setFont("helvetica", "bold");
  } else {
    doc.setFont("helvetica", "normal");
  }

  const valueText = `${Number(value).toFixed(2)}`;
  const valueX = pageWidth - marginX;
  const labelX = 170;

  // Label on the left side (aligned right)
  doc.setCharSpace(0);
  doc.text(label, labelX, rightY, { align: "right" });

  if (isBold) {
    // 👉 Add rupee icon *only* if it's a bold value (e.g., Total, Balance Due)
    const imageSize = 2;
    const imageMarginRight = 1.5;
    const imageX = valueX - doc.getTextWidth(valueText) - imageSize - imageMarginRight;
    const imageY = rightY - 3; // Adjust Y based on your spacing
    doc.addImage(rupeeImg, "PNG", imageX, imageY+1, imageSize, imageSize);

    // Add value after image
    doc.setCharSpace(0);
    doc.text(valueText, valueX, rightY, { align: "right" });
  } else {
    // Just plain text without image
    doc.setCharSpace(0);
    doc.text(valueText, valueX, rightY, { align: "right" });
  }

  doc.setCharSpace(0); // reset
  rightY += lineSpacing;
};


  // 1. Start Y for totals section
  const totalsStartY = rightY;

  // 2. Totals rendering
  alignRightSection("Sub Total", invoiceData.subTotal || 0);
alignRightSection(
  `IGST (${invoiceData.items?.[0]?.percentage || 0}%)`,
  invoiceData.igstAmount || 0
);
alignRightSection(
  "Amount Withheld (Section 194J)",
  invoiceData.amountWithheld || 0
);
alignRightSection("Total", invoiceData.totalAmount || 0, true); // with icon
alignRightSection("Balance Due", invoiceData.dueAmount || 0, true); // with icon


  // 3. End Y after rendering totals
  const totalsEndY = rightY;

  // 4. Draw rectangle border around totals
  const boxMarginRight = marginX;
  const boxMarginLeft = 118; // Adjust to match labelX or slightly before
  const boxWidth = pageWidth - boxMarginRight - boxMarginLeft;
  const boxHeight = totalsEndY - totalsStartY + 10;

  doc.setLineWidth(0.3);
  doc.setDrawColor(0);
  doc.rect(
    boxMarginLeft,
    totalsStartY - lineSpacing - 4,
    boxWidth + 3,
    boxHeight
  );

  doc.setFont("helvetica", "normal");
  doc.setCharSpace(0);
  // 6. Left Notes/Words Section
  let leftY = tableEndY + 10;
  doc.setFont("helvetica", "italic");
  doc.text(`Total in Words: ${invoiceData.totalInWords || ""}`, marginX, leftY);
  leftY += lineSpacing * 2;
  doc.setFont("helvetica", "normal");
  // Draw the "Notes:" label
  doc.setFont("helvetica", "bold");
  doc.text("Notes:", marginX, leftY);

  // Prepare wrapped note text
  const maxWidth = doc.internal.pageSize.getWidth() / 2;
  const noteText = invoiceData.notes || "";
  const wrappedNotes = doc.splitTextToSize(noteText, maxWidth);

  // Switch to normal font for note content
  doc.setFont("helvetica", "normal");

  // Print wrapped note lines below the label
  leftY += lineSpacing;
  wrappedNotes.forEach((line: string) => {
    doc.text(line, marginX, leftY);
    leftY += lineSpacing;
  });

  // Leave extra space after Notes section
  leftY += lineSpacing;

  // Terms & Conditions
  doc.setFont("helvetica", "bold");
  doc.text("Terms & Conditions:", marginX, leftY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const installments = invoiceData.installments || [];

  const terms = [
    `Total amount:  ${String(invoiceData.totalAmount ?? "0.00")} + GST`,
    ...installments.map((inst: any) => {
      const title = inst.name?.trim() || "Installment";
      const amount = String(inst.amount ?? "0.00");
      const details = inst.description?.trim() || "";
      return `${title}:  ${amount}${details ? " - " + details : ""}`;
    }),
  ];

  let currentY = leftY;

  const wrapText = (text: string, maxWidth: number, doc: jsPDF) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (doc.getTextWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  terms.forEach((term) => {
    const wrappedLines = wrapText(term, maxWidth, doc);
    wrappedLines.forEach((line) => {
      // doc.setCharSpace(index === 0 ? -0.5 : 0); // Only apply -0.5 for first line
      doc.text(line, marginX, (currentY += lineSpacing));
    });
  });

  doc.setCharSpace(0);

  // Bank Info
  let bankY = leftY + 4 * lineSpacing + 20; // Adjusted for spacing
  doc.setFont("helvetica", "bold");
  doc.text("Bank Account Details:", marginX, bankY);
  doc.setFont("helvetica", "normal");
  doc.text("Bank Name: HDFC BANK Ltd.", marginX, (bankY += lineSpacing));
  doc.text("Account No: 50200096137259", marginX, (bankY += lineSpacing));
  doc.text("IFSC Code: HDFC0000193", marginX, (bankY += lineSpacing));
  doc.text("Account Branch: HSR LAYOUT", marginX, (bankY += lineSpacing));

  const signatureY = totalsEndY + 10;

  // Draw rectangle for signature block
  const boxX = 118;
  const boxY = signatureY - 10;
  const boxWidth2 = pageWidth - marginX - boxX;
  const boxHeight2 = 30;

  doc.setDrawColor(100);
  doc.rect(boxX, boxY, boxWidth2 + 3, boxHeight2);

  // Left side: Bold Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("RISHI", boxX + 4, boxY + 10);
  doc.text("RAJ", boxX + 4, boxY + 18);

  // Right side: Digital Signing Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const now = new Date();
  const currentDateTime = now.toISOString().slice(0, 19).replace("T", " "); // "2025-07-16 11:45:00"

  const signingText = [
    "Digitally signed by",
    "RISHI RAJ",
    `Date: ${currentDateTime.slice(0, 10)}`, // "2025-07-16"
    `${now.toLocaleTimeString("en-IN")} +05'30'`,
  ];

  signingText.forEach((line, i) => {
    doc.text(line, boxX + boxWidth2 / 2 + 5, boxY + 8 + i * 6);
  });

  // Footer text below signature box
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Authorized Signature", pageWidth - marginX, boxY + boxHeight2 + 5, {
    align: "right",
  });

  doc.save(`Invoice_${invoiceData.invoiceNumber || "INV"}.pdf`);
};
