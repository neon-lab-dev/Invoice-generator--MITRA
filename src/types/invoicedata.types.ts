export type TInvoice = {
  _id: string;
  customInvoiceId: string;
  invoiceDate: string;
  dueDate: string;
  terms: string;
  notes: string;
  placeOfSupply: string;
  GSTIN: string;
  totalAmount: number;
  subTotal: number;
  igst: number;
  amountWitheld: number;
  dueAmount: number;
  createdAt: string;
  updatedAt: string;
  billTo: {
    name: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    gst: string;
    _id: string;
  }[];
  shipTo: {
    name: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    gst: string;
    _id: string;
  }[];
  installments: {
    name: string;
    amount: number;
    description: string;
    _id: string;
  }[];
  invoiceItems: {
    item: string;
    hsn: string;
    qty: number;
    rate: number;
    amount: number;
    _id: string;
  }[];
};
