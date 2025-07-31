/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm, useFieldArray,useWatch } from "react-hook-form";
import { FiX } from "react-icons/fi";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import { toast } from "sonner";
import Loader from "../../../components/Reusable/Loader/Loader";
import axios from "axios";
import Cookies from "js-cookie";
import type { InvoiceFormData } from "./AddInvoiceModal";
import SelectInput from "../../../components/Reusable/SelectInput/SelectInput";
import { generateInvoicePDF } from "../../../utils/InvoiceFormat";

interface UpdateInvoiceModalProps {
  invoiceId: string;
  onClose: () => void;
  isFetchingUserById: boolean;
}

export const formatDate = (input: any) => {
  if (!input) return "";
  const date = new Date(input);
  return date.toISOString().split("T")[0];
};

const STATES = [
  "Maharashtra",
  "Gujarat",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
];
const TERMS = ["Due on Receipt", "Net 15", "Net 30", "Net 60"];
// const INVOICE_TYPES = ["Project", "Course"];

const UpdateInvoiceModal: React.FC<UpdateInvoiceModalProps> = ({
  invoiceId,
  onClose,
}) => {
  // const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<InvoiceFormData>();

  const { fields: itemFields, append: appendItem } = useFieldArray({
    control,
    name: "items",
  });
  const items = useWatch({ control, name: "items" });
const installments = useWatch({ control, name: "paymentTerms.installments" });
const amountWithheld = watch("amountWithheld") || 0;
  const { fields: installmentFields, append: appendInstallment } =
    useFieldArray({
      control,
      name: "paymentTerms.installments",
    });

  // Fetch invoice by ID and prefill form
  useEffect(() => {
    const fetchInvoiceById = async () => {
      try {
        setIsFetching(true);
        const token = Cookies.get("token");

        const res = await axios.get(
          `https://invoice-chi-five.vercel.app/api/v1/invoice/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const invoice = res.data?.invoice;
        // console.log(invoice);
        reset({
          invoiceDate: formatDate(invoice.invoiceDate),
          dueDate: formatDate(invoice.dueDate),
          terms: invoice.terms,
          notes: invoice.notes,
          placeOfSupply: invoice.placeOfSupply,
          billTo: {
            ...invoice.billTo?.[0],
            gstin: invoice.billTo?.[0]?.gst || "", // Map gst → gstin
          },
          shipTo: {
            ...invoice.shipTo?.[0],
            gstin: invoice.shipTo?.[0]?.gst || "",
          },

          paymentTerms: {
            totalAmount: invoice.totalAmount,
            installments:
              invoice.installments?.map((i: any) => ({
                installmentTitle: i.name,
                installmentAmount: i.amount,
                details: i.description,
              })) || [],
          },
          items:
            invoice.invoiceItems?.map((item: any) => ({
              description: item.item,
              hsnCode: item.hsn,
              quantity: item.qty,
              rate: item.rate,
              amount: item.amount,
              percentage: 18,
              igstAmount: 0,
            })) || [],
          subTotal: invoice.subTotal,
          igstAmount: invoice.igst,
          amountWithheld: invoice.amountWitheld,
          totalAmount: invoice.totalAmount,
          dueAmount: invoice.dueAmount,
        });
        if (!invoice.invoiceItems?.length) appendItem({});
        if (!invoice.installments?.length) appendInstallment({});
      } catch (err) {
        toast.error("Failed to fetch invoice data");
        onClose();
      } finally {
        setIsFetching(false);
      }
    };

    fetchInvoiceById();
  }, [invoiceId, reset]);

  useEffect(() => {
    if (!items) return;

    let subTotal = 0;
    let totalIgst = 0;

    items.map((item, index) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const amount = quantity * rate;
      const gstPercent = Number(item.percentage || 0);
      const igstAmount = (amount * gstPercent) / 100;

      subTotal += amount;
      totalIgst += igstAmount;

      // Update amount and igstAmount in form
      setValue(`items.${index}.amount`, amount);
      setValue(`items.${index}.igstAmount`, igstAmount);

      return { amount, igstAmount };
    });
    // console.log(updatedItems)

    setValue("subTotal", subTotal);
    setValue("igstAmount", totalIgst);
  }, [items, setValue]);

  useEffect(() => {
  const subTotal = watch("subTotal") || 0;
  const subgst=watch("igstAmount")||0;
  // const igstAmount = watch("igstAmount") || 0;
  const totalInstallmentsAmount = watch("paymentTerms.totalAmount") || 0;
   

   const totalAmount = subTotal +subgst -amountWithheld;
    const dueAmount = totalInstallmentsAmount-totalAmount +subgst -amountWithheld;

  setValue("totalAmount", totalAmount);
  setValue("dueAmount", dueAmount);
}, [
  watch("subTotal"),
  watch("igstAmount"),
  watch("paymentTerms.totalAmount"),
  amountWithheld,
  installments,
  setValue,
]);

  const onSubmit = async (data: InvoiceFormData) => {
    const toastId = toast.loading("Updating invoice...");
    console.log(data.invoiceDate?.split("T")[0]);
    try {
      const payload = {
        invoiceDate: formatDate(data.invoiceDate),
        dueDate: formatDate(data.dueDate),
        terms: data.terms,
        notes: data.notes,
        placeOfSupply: data.placeOfSupply,
        invoiceType: data.invoiceType,
        billTo: [data.billTo],
        shipTo: [data.shipTo],
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
      const token = Cookies.get("token");
      const res = await axios.put(
        `https://invoice-chi-five.vercel.app/api/v1/invoice/${invoiceId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if(res.status === 200)  generateInvoicePDF(res.data?.updatedInvoice);
      
      toast.success("Invoice updated successfully!", { id: toastId });
      onClose();

      // window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed", {
        id: toastId,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-fadeIn"
      onClick={onClose}
    >
      {isFetching ? (
        <div
          className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 text-center animate-scaleIn h-[450px] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader size={40} />
        </div>
      ) : (
        <div
          className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FiX size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Update Invoice
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                type="date"
                label="Invoice Date"
                {...register("invoiceDate")}
              />
              <TextInput
                type="date"
                label="Due Date"
                {...register("dueDate")}
              />
            </div>

            <SelectInput
              label="Terms"
              options={TERMS.map((term) => ({ label: term, value: term }))}
              {...register("terms")}
            />

            <div className="flex flex-col gap-2 font-Inter w-full">
              <label
                htmlFor="notes"
                className="block text-gray-700 font-medium"
              >
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
      )}
    </div>
  );
};

export default UpdateInvoiceModal;
