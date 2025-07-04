import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiMoreVertical, FiTrash2, FiEdit2 } from "react-icons/fi";
import type { TUser } from "../../../types/users.types";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Loader from "../../../components/Reusable/Loader/Loader";
import axios from "axios";
import UpdateInvoiceModal from "./UpdateInvoiceModal";
import AddInvoiceModal from "./AddInvoiceModal";

const Invoices = () => {
  const { register, watch } = useForm({ defaultValues: { search: "" } });
  const searchTerm = watch("search");
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingUserById, setIsFetchingUserById] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const token = Cookies.get("accessToken");

  // Fetch user by ID
  const fetchUserById = async (userId: string) => {
    setIsFetchingUserById(true);

    try {
      const res = await axios.get(
        `https://admin-delta-rosy.vercel.app/api/people/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setSelectedUser(res.data?.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch user by ID:", err);
      toast.error("Failed to fetch user data");
      setIsModalOpen(false);
    } finally {
      setIsFetchingUserById(false);
    }
  };

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://admin-delta-rosy.vercel.app/api/people",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUsers(res.data?.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const deleteUser = async (userId: string) => {
    const toastId = toast.loading("Deleting user...");

    try {
      const res = await fetch(
        `https://admin-delta-rosy.vercel.app/api/people/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully", { id: toastId });
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
      console.error(error);
    }
  };

  const filteredUsers = users?.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user?.name?.toLowerCase().includes(term) ||
      user?.email?.toLowerCase().includes(term)
    );
  });

  const toggleDropdown = (id: string) =>
    setDropdownOpen((prev) => (prev === id ? null : id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRefs.current.has(dropdownOpen) &&
        !dropdownRefs.current.get(dropdownOpen)?.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
  return (
    <div className="mt-5 max-w-full">
      <div className="mb-4 flex items-center gap-5 justify-end w-full">
        <input
          id="search"
          type="text"
          placeholder="Search by invoice name"
          {...register("search")}
          className="flex w-full max-w-[400px] rounded-md border border-primary-10/30 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-transform focus:scale-[1.02] focus:ring-2 focus:ring-primary-10 focus:outline-none"
        />

        <button
          type="submit"
          className={`rounded-md px-4 py-2 font-medium text-white cursor-pointer bg-primary-10 hover:bg-primary-10/90 active:scale-95 transition-all duration-300 ease-in-out transform hover:scale-105`}
          onClick={() => setIsAddPeopleModalOpen(true)}
        >
          Create Invoice
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              {[
                "Sl",
                "Name",
                "Email",
                "Invoice Issue Date",
                "Invoice",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex justify-center items-center gap-3 py-6">
                    <Loader size={25} />
                    <p className="text-gray-800">Please wait...</p>
                  </div>
                </td>
              </tr>
            ) : filteredUsers?.length > 0 ? (
              filteredUsers?.map((user, idx) => (
                <tr
                  key={user.id || idx}
                  className="hover:bg-gray-50 even:bg-white relative"
                >
                  <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 border-b border-gray-200">
                    {user?.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                    {user?.email}
                  </td>
                 
                  <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                    {user?.createdAt || "-"}
                  </td>
                   <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200 hover:underline">
                    <a
                      href={
                        user?.linkedInUrl?.startsWith("http")
                          ? user.linkedInUrl
                          : `https://${user?.linkedInUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user?.linkedInUrl}
                    </a>
                  </td>
                  <td className="relative px-4 py-3 text-sm border-b border-gray-200">
                    <div
                      ref={(el) => {
                        if (el && user?.id) {
                          dropdownRefs.current.set(user?.id, el);
                        }
                      }}
                      className="relative inline-block text-left"
                    >
                      <button
                        onClick={() => toggleDropdown(user?.id)}
                        className="flex items-center p-1 rounded hover:bg-gray-200 transition cursor-pointer"
                        aria-label="Open actions menu"
                      >
                        <FiMoreVertical size={20} />
                      </button>

                      {dropdownOpen === user?.id && (
                        <div className="absolute right-6 bottom-0 mb-2 w-40 rounded-md bg-white shadow-lg border border-gray-200 z-50 animate-fadeUp">
                          <ul>
                            <li>
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSelectedUserId(user?.id);
                                  fetchUserById(user?.id);
                                  setIsModalOpen(true);
                                  setDropdownOpen(null);
                                }}
                              >
                                <FiEdit2 className="mr-2" /> Update
                              </button>
                            </li>
                            <li>
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                                onClick={() => {
                                  const confirmDelete = confirm(
                                    `Are you sure you want to delete ${user.name}?`
                                  );
                                  if (confirmDelete) {
                                    deleteUser(user?.id || "");
                                  }
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>
        {`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(10%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.2s ease forwards;
        }
      `}
      </style>

      {isModalOpen && selectedUserId && (
        <UpdateInvoiceModal
          userId={selectedUserId}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          isFetchingUserById={isFetchingUserById}
        />
      )}

      {isAddPeopleModalOpen && (
        <AddInvoiceModal onClose={() => setIsAddPeopleModalOpen(false)} />
      )}
    </div>
  );
};

export default Invoices;
