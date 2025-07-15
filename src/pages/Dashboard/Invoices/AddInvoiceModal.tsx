import { useForm, useFieldArray } from "react-hook-form";
import { FiX } from "react-icons/fi";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import { toast } from "sonner";
import SelectInput from "../../../components/Reusable/SelectInput/SelectInput";
import { generateInvoicePDF } from "../../../utils/InvoiceFormat";
import axios from "axios";
import { useState } from "react";

interface Installment {
  installmentTitle?: string;
  installmentAmount?: number;
  details?: string;
}

interface InvoiceItem {
  description?: string;
  hsnCode?: string;
  quantity?: number;
  rate?: number;
  amount?: number;
  percentage?: number;
  igstAmount?: number;
}

interface Address {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  gstin?: string;
}

interface InvoiceFormData {
  invoiceType?: string;
  invoiceDate?: string;
  dueDate?: string;
  terms?: string;
  notes?: string;
  placeOfSupply?: string;
  billTo?: Address;
  shipTo?: Address;
  paymentTerms?: {
    totalAmount?: number;
    installments: Installment[];
  };
  items: InvoiceItem[];
  subTotal?: number;
  igstAmount?: number;
  amountWithheld?: number;
  totalAmount?: number;
  dueAmount?: number;
}

interface AddInvoiceModalProps {
  onClose: () => void;
}

const STATES = [
  "Maharashtra",
  "Gujarat",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
];
const TERMS = ["Due on Receipt", "Net 15", "Net 30", "Net 60"];
const INVOICE_TYPES = ["Project", "Course"];

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      invoiceType: "Project",
      invoiceDate: "2025-07-08",
      dueDate: "2025-07-15",
      terms: "Net 15",
      notes: "This is a test invoice for preview purposes.",
      placeOfSupply: "Maharashtra",
      billTo: {
        name: "John Doe",
        address: "123, Baker Street",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
        country: "India",
        gstin: "27ABCDE1234F1Z5",
      },
      shipTo: {
        name: "Jane Smith",
        address: "456, Market Street",
        city: "Pune",
        state: "Maharashtra",
        pinCode: "411001",
        country: "India",
        gstin: "27ABCDE5678G1Z9",
      },
      paymentTerms: {
        totalAmount: 5000,
        installments: [
          {
            installmentTitle: "Advance",
            installmentAmount: 2500,
            details: "Paid before starting project",
          },
          {
            installmentTitle: "Final Payment",
            installmentAmount: 2500,
            details:
              "Due on project completion Due on project completionDue on project completionDue on project completionDue on project completion",
          },
        ],
      },
      items: [
        {
          description: "Website Development",
          hsnCode: "998313",
          quantity: 1,
          rate: 4000,
          amount: 4000,
          percentage: 18,
          igstAmount: 720,
        },
        {
          description: "Domain & Hosting",
          hsnCode: "998314",
          quantity: 1,
          rate: 1000,
          amount: 1000,
          percentage: 18,
          igstAmount: 180,
        },
      ],
      subTotal: 5000,
      igstAmount: 900,
      amountWithheld: 0,
      totalAmount: 5900,
      dueAmount: 2500,
    },
  });

  const [invoice,setInvoice ]=useState({})
  const { fields: itemFields, append: appendItem } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: installmentFields, append: appendInstallment } =
    useFieldArray({
      control,
      name: "paymentTerms.installments",
    });

  const onSubmit = async (data: InvoiceFormData) => {
    const toastId = toast.loading("Submitting invoice...");

    try {
      const payload = {
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        terms: data.terms,
        notes: data.notes,
        placeOfSupply: data.placeOfSupply,
        billTo: [
          {
            name: data.billTo?.name,
            address: data.billTo?.address,
            city: data.billTo?.city,
            state: data.billTo?.state,
            pinCode: data.billTo?.pinCode,
            country: data.billTo?.country,
            gst: data.billTo?.gstin,
          },
        ],
        shipTo: [
          {
            name: data.shipTo?.name,
            address: data.shipTo?.address,
            city: data.shipTo?.city,
            state: data.shipTo?.state,
            pinCode: data.shipTo?.pinCode,
            country: data.shipTo?.country,
            gst: data.shipTo?.gstin,
          },
        ],
        GSTIN: data.billTo?.gstin,
        totalAmount: data.totalAmount,
        installments: data.paymentTerms?.installments.map((i) => ({
          name: i.installmentTitle,
          amount: i.installmentAmount,
          description: i.details,
        })),
        invoiceItems: data.items.map((item) => ({
          item: item.description,
          hsn: item.hsnCode,
          qty: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
        subTotal: data.subTotal,
        igst: data.igstAmount,
        amountWitheld: data.amountWithheld,
        dueAmount: data.dueAmount,
      };

      const res = await axios.post(
        "https://invoice-chi-five.vercel.app/api/v1/invoice/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // If needed for auth/session
        }
      );
      // setInvoice(res.data?.data)
      generateInvoicePDF(res.data?.data);
      // generateInvoicePDF(data)
      console.log(res.data?.data);
      toast.success("Invoice created successfully!", { id: toastId });

      // Optional: Reset or close modal
      reset();
      onClose();
    } catch (err: any) {
      console.error("Error creating invoice", err);
      toast.error(err?.response?.data?.message || "Failed to create invoice", {
        id: toastId,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            reset();
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create Invoice
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Invoice Meta */}
          <SelectInput
            label="Invoice Type"
            options={INVOICE_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
            {...register("invoiceType")}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              type="date"
              label="Invoice Date"
              {...register("invoiceDate")}
            />
            <TextInput type="date" label="Due Date" {...register("dueDate")} />
          </div>

          <SelectInput
            label="Terms"
            options={TERMS.map((term) => ({ label: term, value: term }))}
            {...register("terms")}
          />

          <div className="flex flex-col gap-2 font-Inter w-full">
            <label htmlFor="notes" className="block text-gray-700 font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              placeholder="Enter any notes here..."
              rows={4}
              {...register("notes")}
              className="w-full rounded-md border border-primary-10/30 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-transform focus:scale-[1.02] focus:ring-2 focus:ring-primary-10 focus:outline-none"
            />
            {errors.notes?.message && (
              <span className="text-red-500 text-sm">
                {String(errors.notes.message)}
              </span>
            )}
          </div>

          <SelectInput
            label="Place of Supply"
            options={STATES.map((state) => ({ label: state, value: state }))}
            {...register("placeOfSupply")}
          />

          {/* Bill To */}
          <div>
            <h3 className="font-bold text-gray-700">Bill To</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Name" {...register("billTo.name")} />
              <TextInput label="Address" {...register("billTo.address")} />
              <TextInput label="City" {...register("billTo.city")} />
              <TextInput label="State" {...register("billTo.state")} />
              <TextInput label="Pin Code" {...register("billTo.pinCode")} />
              <TextInput label="Country" {...register("billTo.country")} />
              <TextInput label="GSTIN" {...register("billTo.gstin")} />
            </div>
          </div>

          {/* Ship To */}
          <div>
            <h3 className="font-bold text-gray-700">Ship To</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Name" {...register("shipTo.name")} />
              <TextInput label="Address" {...register("shipTo.address")} />
              <TextInput label="City" {...register("shipTo.city")} />
              <TextInput label="State" {...register("shipTo.state")} />
              <TextInput label="Pin Code" {...register("shipTo.pinCode")} />
              <TextInput label="Country" {...register("shipTo.country")} />
              <TextInput label="GSTIN" {...register("shipTo.gstin")} />
            </div>
          </div>

          {/* Payment Terms */}
          <TextInput
            label="Total Amount"
            type="number"
            {...register("paymentTerms.totalAmount")}
          />

          <h4 className="font-medium">Installments</h4>
          {installmentFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-4">
              <TextInput
                placeholder="Title"
                {...register(
                  `paymentTerms.installments.${index}.installmentTitle`
                )}
              />
              <TextInput
                placeholder="Amount"
                type="number"
                {...register(
                  `paymentTerms.installments.${index}.installmentAmount`
                )}
              />
              <TextInput
                placeholder="Details"
                {...register(`paymentTerms.installments.${index}.details`)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendInstallment({})}
            className="text-blue-600 underline text-sm"
          >
            + Add Installment
          </button>

          {/* Invoice Items */}
          <h4 className="font-medium">Invoice Items</h4>
          {itemFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 gap-4">
              <TextInput
                placeholder="Description"
                {...register(`items.${index}.description`)}
              />
              <TextInput
                placeholder="HSN Code"
                {...register(`items.${index}.hsnCode`)}
              />
              <TextInput
                placeholder="Quantity"
                type="number"
                {...register(`items.${index}.quantity`)}
              />
              <TextInput
                placeholder="Rate"
                type="number"
                {...register(`items.${index}.rate`)}
              />
              <TextInput
                placeholder="Amount"
                type="number"
                {...register(`items.${index}.amount`)}
              />
              <TextInput
                placeholder="GST %"
                type="number"
                {...register(`items.${index}.percentage`)}
              />
              <TextInput
                placeholder="IGST Amt"
                type="number"
                {...register(`items.${index}.igstAmount`)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendItem({})}
            className="text-blue-600 underline text-sm"
          >
            + Add Item
          </button>

          {/* Summary Fields */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Sub Total"
              type="number"
              {...register("subTotal")}
            />
            <TextInput
              label="IGST Amount"
              type="number"
              {...register("igstAmount")}
            />
            <TextInput
              label="Amount Withheld"
              type="number"
              {...register("amountWithheld")}
            />
            <TextInput
              label="Total Amount"
              type="number"
              {...register("totalAmount")}
            />
            <TextInput
              label="Due Amount"
              type="number"
              {...register("dueAmount")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary-10 hover:bg-[#244F5B] text-white py-2 px-4 rounded-md"
          >
            Create Invoice
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }

        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default AddInvoiceModal;
