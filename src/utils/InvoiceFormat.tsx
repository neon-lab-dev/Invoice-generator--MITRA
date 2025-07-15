import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  doc.text(`# : ${invoiceData.customInvoiceId
|| "INV-XXX"}`, marginX, y);
  doc.text(`Date : ${invoiceData.createdAt
}`, marginX, (y += lineSpacing));
  doc.text(`Terms : ${invoiceData.terms
}`, marginX, (y += lineSpacing));
  doc.text(`Due Date : ${invoiceData.dueDate
}`, marginX, (y += lineSpacing));

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
console.log(billTo.name)
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
  item.hsn || "",  // HSN/SAC
  item.qty || 0,   // Qty
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

  const valueText = `₹ ${Number(value).toFixed(2)}`;

  // Calculate X positions
  // const valueWidth = doc.getTextWidth(valueText);
  const valueX = pageWidth - marginX;
  const labelX = (170); // 10px gap between label and value

  // Label with normal char spacing
  doc.setCharSpace(0);
  doc.text(label, labelX, rightY, { align: "right" });

  // Value with tighter spacing
  doc.setCharSpace(-0.5);
  doc.text(valueText, valueX, rightY, { align: "right" });

  // Reset char spacing if needed later
  doc.setCharSpace(0);

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
alignRightSection("Total", invoiceData.totalAmount || 0, true);
alignRightSection("Balance Due", invoiceData.dueAmount || 0, true); // bold

// 3. End Y after rendering totals
const totalsEndY = rightY;

// 4. Draw rectangle border around totals
const boxMarginRight = marginX;
const boxMarginLeft = 118; // Adjust to match labelX or slightly before
const boxWidth = pageWidth - boxMarginRight - boxMarginLeft;
const boxHeight = totalsEndY - totalsStartY + 10;

doc.setLineWidth(0.3);
doc.setDrawColor(0);
doc.rect(boxMarginLeft, totalsStartY - lineSpacing-4 , boxWidth+3, boxHeight);



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
  `Total amount: ₹ ${String(invoiceData.totalAmount ?? "0.00")} + GST`,
  ...installments.map((inst: any) => {
    const title = inst.name?.trim() || "Installment";
    const amount = String(inst.amount ?? "0.00");
    const details = inst.description?.trim() || "";
    return `${title}: ₹ ${amount}${details ? " - " + details : ""}`;
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
    wrappedLines.forEach((line, index) => {
      doc.setCharSpace(index === 0 ? -0.5 : 0); // Only apply -0.5 for first line
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
doc.rect(boxX, boxY, boxWidth2+3, boxHeight2);

// Left side: Bold Name
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("RISHI", boxX + 4, boxY + 10);
doc.text("RAJ", boxX + 4, boxY + 18);

// Right side: Digital Signing Info
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
const signingText = [
  "Digitally signed by",
  "RISHI RAJ",
  "Date: 2025.03.28",
  "12:53:47 +05'30'",
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
