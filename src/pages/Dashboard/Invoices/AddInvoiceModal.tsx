/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";

interface AddInvoiceModalProps {
  onClose: () => void;
}

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handAddPeople = async (formData: FormData) => {
    const toastId = toast.loading("Loading...");
    const token = Cookies.get("accessToken");

    try {
      await axios.post(
        `https://admin-delta-rosy.vercel.app/api/people`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("People added successfully", { id: toastId });
    } catch (error) {
      toast.error("Something went wrong!", { id: toastId });
      console.error("Add Error:", error);
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("designation", data.designation);
    formData.append("linkedInUrl", data.linkedInUrl);
    formData.append("writeUp", data.writeUp);
    formData.append("station", data.station);

    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    await handAddPeople(formData);
    onClose();
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-[450px] md:h-[600px] overflow-y-auto rounded-lg shadow-lg p-6 relative animate-scaleIn"
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
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add People</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("file")}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0 file:text-sm file:font-semibold
               file:bg-primary-10 file:text-white hover:file:bg-[#244F5B]"
            />
          </div>

          <TextInput
            label="Name"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />
          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            error={errors.email}
          />
          <TextInput
            label="Designation"
            placeholder="Enter your designation"
            {...register("designation")}
            error={errors.designation}
          />
          <TextInput
            label="LinkedIn Url"
            placeholder="Enter your linkedIn profile url"
            {...register("linkedInUrl")}
            error={errors.linkedInUrl}
          />
          <TextInput
            label="Bio"
            placeholder="Enter your bio"
            {...register("writeUp")}
            error={errors.writeUp}
          />
          <TextInput
            label="Station"
            placeholder="Enter your station"
            {...register("station")}
            error={errors.station}
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary-10 hover:bg-[#244F5B] active:scale-95 px-4 py-2 text-white font-medium transition duration-300 cursor-pointer"
          >
            Add People
          </button>
        </form>
      </div>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}
      </style>
    </div>
  );
};

export default AddInvoiceModal;
