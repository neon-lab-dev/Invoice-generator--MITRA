/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

import OpenSansRegular from "../../../../assets/fonts/OpenSans-Regular.ttf";
import OpenSansBold from "../../../../assets/fonts/OpenSans-Bold.ttf";
import OpenSansSemiBold from "../../../../assets/fonts/OpenSans-SemiBold.ttf";
import OpenSansSemiBoldItalic from "../../../../assets/fonts/OpenSans-SemiBoldItalic.ttf";
import { formatDate } from "../../../../pages/Dashboard/Invoices/UpdateInvoiceModal";
import { numberToWords } from "../../../../utils/numberToWords";
import rupee from "../../../../assets/icons/rupee.png";

Font.register({
  family: "Open Sans",
  fonts: [
    { src: OpenSansRegular },
    { src: OpenSansBold, fontWeight: "bold" },
    { src: OpenSansSemiBold, fontWeight: "semibold" },
    {
      src: OpenSansSemiBoldItalic,
      fontWeight: "semibold",
      fontStyle: "italic",
    },
  ],
});

// Color scheme
const colors = {
  neutral: {
    10: "#000",
    20: "#0000008f",
    30: "#0000003d", // border
    40: "#000000a3",
  },
};

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontFamily: "Open Sans",
    backgroundColor: "#fff",
  },
  container: {
    border: "1px solid #c2c2c2",
  },
  nameHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.neutral[10],
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    fontWeight: "normal",
    color: colors.neutral[10],
    lineHeight: 1.4,
    textAlign: "left",
  },
  invoiceHeading: {
    fontSize: 25,
    fontWeight: "normal",
    color: colors.neutral[10],
  },
  header: {
    padding: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // Invoice Details
  invoiceDetails: {
    flexDirection: "row",
    borderTop: "1px solid #c2c2c2",
  },

  leftSection: {
    flex: 1,
    padding: 4,
  },

  rightSection: {
    flex: 1,
    padding: 4,
    justifyContent: "flex-start",
  },

  divider: {
    width: 1,
    backgroundColor: "#c2c2c2",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 10,
    color: colors.neutral[20],
    width: 170,
  },
  colon: {
    width: 10,
    textAlign: "center",
    fontSize: 10,
  },

  value: {
    fontSize: 10,
    fontWeight: "semibold",
    color: colors.neutral[10],
    flex: 1,
  },

  // Bill To & Ship To
  billToShipToContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #c2c2c2",
  },

  billToContainer: {
    padding: 4,
    backgroundColor: "#0000000a",
    width: "50%",
  },
  billToHeading: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.neutral[10],
    textAlign: "left",
  },
});

const InvoicePdf = ({ invoice }: any) => {
  const invoiceDetails = [
    { label: "#", value: invoice?.customInvoiceId },
    { label: "Invoice Date", value: formatDate(invoice?.invoiceDate) },
    { label: "Terms", value: invoice?.terms },
    { label: "Due Date", value: formatDate(invoice?.dueDate) },
  ];

  const billTo = invoice?.billTo[0];
  const shipTo = invoice?.shipTo[0];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            {/* LEFT */}
            <View style={{ width: 275 }}>
              <Text style={styles.nameHeading}>MITRATECH VENTURES</Text>
              <Text style={styles.description}>
                Revenue Circle 211, New Holding No. 23A, Old Holding No. 18C/16,
                Circle Patna City, Ward No. 70, Property No. 1453701, H/O Ajay
                Kumar Jaiswal Nandgola, Patna, Patna, Bihar, 800008
              </Text>
              <Text style={styles.description}>India</Text>
              <Text style={styles.description}>GSTIN 10AAZPJ4368D1ZN</Text>
            </View>

            {/* RIGHT */}
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={styles.invoiceHeading}>TAX INVOICE</Text>
            </View>
          </View>

          {/* Invoice Details */}
          <View style={styles.invoiceDetails}>
            {/* LEFT */}
            <View style={styles.leftSection}>
              {invoiceDetails?.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.colon}>:</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* RIGHT */}
            <View style={styles.rightSection}>
              <View style={styles.row}>
                <Text style={styles.label}>Place Of Supply</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{invoice?.placeOfSupply}</Text>
              </View>
            </View>
          </View>

          {/* Bill To & Ship To  */}
          <View style={styles.billToShipToContainer}>
            {/* Bill To */}
            <View style={styles.billToContainer}>
              <Text style={styles.billToHeading}>Bill To</Text>
            </View>
            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* Ship To */}
            <View style={styles.billToContainer}>
              <Text style={styles.billToHeading}>Ship To</Text>
            </View>
          </View>

          <View style={styles.billToShipToContainer}>
            <View
              style={{ padding: 4, width: "50%", textTransform: "capitalize" }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color: colors.neutral[10],
                  marginBottom: 3,
                }}
              >
                {billTo?.name}
              </Text>
              <Text style={styles.description}>
                {billTo?.address},{"\n"}
                {billTo?.city},{"\n"}
                {billTo?.pinCode}, {billTo?.state},{"\n"}
                {billTo?.country}
                {"\n"}
                GSTIN {invoice?.GSTIN}
              </Text>
            </View>
            {/* DIVIDER */}

            <View style={styles.divider} />

            <View
              style={{
                padding: 4,
                display: "flex",
                alignItems: "flex-start",
                width: "50%",
                textTransform: "capitalize",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color: colors.neutral[10],
                  marginBottom: 3,
                }}
              >
                {shipTo?.name}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "normal",
                  color: colors.neutral[10],
                  lineHeight: 1.4,
                }}
              >
                {shipTo?.address},{"\n"}
                {shipTo?.city},{"\n"}
                {shipTo?.pinCode}, {shipTo?.state},{"\n"}
                {shipTo?.country}
                {"\n"}
                GST {shipTo?.gst}
              </Text>
            </View>
          </View>

          {/* Items Table */}
          <View
            style={{
              borderBottom: "1px solid #c2c2c2",
            }}
          >
            {/* Table Header */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#f5f5f5",
                borderTop: "1px solid #c2c2c2",
                borderBottom: "1px solid #c2c2c2",
              }}
            >
              <Text
                style={{
                  width: "5%",
                  padding: 2,
                  fontSize: 10,
                  fontWeight: "bold",
                  borderRight: "1px solid #c2c2c2",
                  textAlign: "center",
                }}
              >
                #
              </Text>
              <Text
                style={{
                  width: "35%",
                  padding: 2,
                  fontSize: 10,
                  fontWeight: "bold",
                  borderRight: "1px solid #c2c2c2",
                }}
              >
                Item & Description
              </Text>
              <Text
                style={{
                  width: "8%",
                  padding: 2,
                  fontSize: 10,
                  fontWeight: "bold",
                  borderRight: "1px solid #c2c2c2",
                  textAlign: "right",
                }}
              >
                Qty
              </Text>
              <Text
                style={{
                  width: "12%",
                  padding: 2,
                  fontSize: 10,
                  fontWeight: "bold",
                  borderRight: "1px solid #c2c2c2",
                  textAlign: "right",
                }}
              >
                Rate
              </Text>

              {/* IGST Header with split */}
              <View
                style={{
                  width: "22%",
                  flexDirection: "column",
                  borderRight: "1px solid #c2c2c2",
                }}
              >
                <Text
                  style={{
                    padding: 2,
                    fontSize: 10,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderBottom: "1px solid #c2c2c2",
                  }}
                >
                  IGST
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "50%",
                      padding: 2,
                      fontSize: 10,
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: "1px solid #c2c2c2",
                    }}
                  >
                    %
                  </Text>
                  <Text
                    style={{
                      width: "50%",
                      padding: 2,
                      fontSize: 10,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Amt
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  width: "18%",
                  padding: 2,
                  fontSize: 10,
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                Amount
              </Text>
            </View>

            {/* Table Row */}
            {invoice?.invoiceItems?.map((item: any, index: number) => (
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    width: "5%",
                    padding: 8,
                    fontSize: 10,
                    borderRight: "1px solid #c2c2c2",
                  }}
                >
                  {index + 1}
                </Text>
                <View
                  style={{
                    width: "35%",
                    padding: 8,
                    borderRight: "1px solid #c2c2c2",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                    {item?.item}
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: 8,
                      color: "#0000008f",
                      lineHeight: 1.3,
                      marginTop: 2,
                    }}
                  >
                    SOC 2 Type 2 Audit{"\n"}
                    End-to-end{"\n"}
                    SOC 2 compliance incl{"\n"}
                    readiness, implementation,{"\n"}
                    monitoring &{"\n"}
                    audit support
                  </Text> */}
                </View>
                <Text
                  style={{
                    width: "8%",
                    padding: 8,
                    fontSize: 10,
                    borderRight: "1px solid #c2c2c2",
                    textAlign: "right",
                  }}
                >
                  {item?.qty}
                </Text>
                <Text
                  style={{
                    width: "12%",
                    padding: 8,
                    fontSize: 10,
                    borderRight: "1px solid #c2c2c2",
                    textAlign: "right",
                  }}
                >
                  {item?.rate}
                </Text>

                {/* IGST Values */}
                <View
                  style={{
                    width: "22%",
                    flexDirection: "row",
                    borderRight: "1px solid #c2c2c2",
                  }}
                >
                  <Text
                    style={{
                      width: "50%",
                      padding: 8,
                      fontSize: 10,
                      textAlign: "right",
                      borderRight: "1px solid #c2c2c2",
                    }}
                  >
                    18%
                  </Text>
                  <Text
                    style={{
                      width: "50%",
                      padding: 8,
                      fontSize: 10,
                      textAlign: "right",
                    }}
                  >
                    {(item?.amount * 0.18).toFixed(2)}
                  </Text>
                </View>

                <Text
                  style={{
                    width: "18%",
                    padding: 8,
                    fontSize: 10,
                    textAlign: "right",
                  }}
                >
                  {(item?.amount).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Total calculation and details */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {/* Details and Bank info */}
            <View style={{ width: "50%", padding: 4 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.neutral[10],
                  marginBottom: 3,
                  fontWeight: "semibold",
                }}
              >
                Total In Words
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "semibold",
                  fontStyle: "italic",
                  color: colors.neutral[10],
                  marginBottom: 8,
                }}
              >
                {numberToWords(invoice?.totalAmount)}
              </Text>

              <Text style={{ ...styles.description, marginBottom: 8 }}>
                <Text style={{ fontWeight: "semibold" }}>Notes</Text>
                {"\n"}
                {invoice?.notes}
              </Text>

              {/* <Text style={{ ...styles.description, marginBottom: 8 }}>
                A 3% payment gateway fee will be charged for payments made
                through the payment link.
              </Text> */}
              <Text style={{ ...styles.description }}>
                <Text style={{ fontWeight: "semibold" }}>
                  Terms & Conditions
                </Text>
                {"\n"}
                <Text style={{ fontWeight: "semibold" }}>
                  Payment Terms:
                </Text>{" "}
                {"\n"}
                <Text style={{ display: "flex", flexDirection: "row", gap: 1 }}>
                  Total Amount:{" "}
                  <Image src={rupee} style={{ width: 6, height: 6 }} />{" "}
                  {invoice?.totalAmount} + GST{"\n"}
                </Text>
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 8,
                }}
              >
                {invoice?.installments?.map((installment: any) => (
                  <Text style={{ ...styles.description, marginBottom: 8 }}>
                    {installment?.name}: {installment?.amount} -{" "}
                    {installment?.description}
                    {"\n"}
                  </Text>
                ))}
              </View>
              <Text style={{ ...styles.description, marginBottom: 8 }}>
                <Text style={{ fontWeight: "semibold" }}>
                  Bank Account Details:
                </Text>
                {"\n"}
                Bank Name: HDFC BANK{"\n"}
                Account No: 50200098434861{"\n"}
                IFSC Code: HDFC0000332{"\n"}
                Account Branch: PATNA - SABZI BAZAR - BIHAR{"\n"}
                {/* SWIFT Code: HDFCINBB{"\n"} */}
              </Text>
            </View>

            {/* Total Calculation */}
            <View
              style={{
                width: "50%",
                alignSelf: "flex-start",
                borderLeft: "1px solid #c2c2c2",
              }}
            >
              {/* Totals */}
              <View
                style={{
                  padding: 4,
                  width: "70%",
                  alignSelf: "flex-end",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 10 }}>Sub Total</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                    }}
                  >
                    <Image src={rupee} style={{ width: 6, height: 6 }} />{" "}
                    {invoice?.subTotal}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 10 }}>IGST18 (18%)</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                    }}
                  >
                    <Image src={rupee} style={{ width: 6, height: 6 }} />{" "}
                    {invoice?.igst}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                    Total
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                    }}
                  >
                    <Image src={rupee} style={{ width: 6, height: 6 }} />{" "}
                    {invoice?.totalAmount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                    Balance Due
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                    }}
                  >
                    <Image src={rupee} style={{ width: 6, height: 6 }} />{" "}
                    {invoice?.dueAmount}
                  </Text>
                </View>
              </View>

              {/* Signature Section */}
              <View
                style={{
                  borderTop: "1px solid #c2c2c2",
                  borderBottom: "1px solid #c2c2c2",
                  paddingTop: 8,
                  padding: 4,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.neutral[10],
                      width: "60%",
                    }}
                  >
                    AJAY KUMAR JAISWAl
                  </Text>
                  <View>
                    <Text
                      style={{
                        fontSize: 6,
                        color: "#666",
                        lineHeight: 1.3,
                      }}
                    >
                      Digitally signed by AJAY KUMAR JAISWAl
                    </Text>
                    <Text style={{ fontSize: 6, color: "#666" }}>
                      Date: 2026.03.17 12:56:50 +05'30'
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: "semibold",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Authorized Signature
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
