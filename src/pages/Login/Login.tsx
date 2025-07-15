/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
// import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (Cookies.get("isAuthenticated") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://invoice-chi-five.vercel.app/api/v1/login",
        data,
        { withCredentials: true }
      );
      console.log(response);
      if (response?.data?.success) {
        Cookies.set("accessToken", response?.data?.data?.accessToken, {
          expires: 2,
        });
        navigate("/dashboard/invoices");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 w-full p-4">
      <div className="mx-auto w-full max-w-md space-y-2 rounded-xl border border-primary-10/30 bg-white/70 backdrop-blur-lg p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-primary-10 text-center">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-primary-10/70">
          Please login to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Email Field */}
          <div className="space-y-2 text-sm">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              className="flex h-11 w-full rounded-md border border-primary-10/30 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-transform focus:scale-[1.02] focus:ring-2 focus:ring-primary-10 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2 text-sm">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="flex h-11 w-full rounded-md border border-primary-10/30 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition-transform focus:scale-[1.02] focus:ring-2 focus:ring-primary-10 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full rounded-md px-4 py-2 font-medium text-white cursor-pointer active:scale-95 transition-all duration-300 ease-in-out transform hover:scale-105 
              ${showPassword
                ? "bg-primary-10/60 cursor-not-allowed"
                : "bg-primary-10 hover:bg-primary-10/80 active:scale-95"
            }
            `}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
