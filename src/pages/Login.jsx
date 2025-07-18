import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ErrorPopup from "../components/ErrorPopup";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (currentState === "Sign Up") {
        if (password !== confirmPassword) {
          setErrorPopup("Passwords do not match!");
          return;
        }
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          role: "user",
        });
        if (response.data.success) {
          toast.success(
            "Your account is registered successfully. Please login."
          );
          setCurrentState("Login");
          setName("");
          setEmail("");
          setPasword("");
          setConfirmPassword("");
        } else {
          setErrorPopup(response.data.message || "Registration failed. Please try again.");
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          const userData = response.data.user;

          // If user is a vendor, fetch their vendor information
          if (userData.role === "vendor") {
            try {
              const vendorResponse = await axios.get(
                `${backendUrl}/api/vendor/stores-list`,
                {
                  headers: {
                    Authorization: `Bearer ${response.data.token}`,
                  },
                }
              );

              console.log("Vendor response:", vendorResponse.data);

              if (vendorResponse.data.status && vendorResponse.data.data) {
                // Find the vendor store for this user
                const userStore = vendorResponse.data.data.find(
                  (store) =>
                    store.user._id === userData._id ||
                    store.user === userData._id
                );

                console.log("Found user store:", userStore);

                if (userStore) {
                  // Update user data with vendorId
                  userData.vendorId = userStore._id;
                  console.log("Updated user data with vendorId:", userData);
                } else {
                  console.log("No store found for user:", userData._id);
                }
              }
            } catch (error) {
              console.error("Error fetching vendor information:", error);
              console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
              });
            }
          }

          setToken(response.data.token);
          toast.success("You are logged in.");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("Stored user data:", userData);

          if (userData.role === "admin" || userData.role === "vendor") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        } else {
          setErrorPopup(response.data.message || "Invalid credentials");
        }
      }
    } catch (error) {
      let msg = "Something went wrong. Please try again.";
      if (error.response) {
        msg = error.response.data?.message || error.response.data || error.message;
      } else if (error.message) {
        msg = error.message;
      }
      setErrorPopup(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
        {/* Left side - Image */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="h-full w-full bg-black bg-opacity-20 p-12 flex items-end">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome to PlantStore</h2>
              <p className="text-lg">
                Bring nature into your home with our curated collection
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="text-center">
              <h2 className="prata-regular text-3xl text-gray-900 mb-2">
                {currentState}
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                {currentState === "Login"
                  ? "Welcome back! Please enter your details"
                  : "Create an account to get started"}
              </p>
            </div>

            {currentState === "Sign Up" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) => setPasword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {currentState === "Sign Up" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600 hover:text-black cursor-pointer">
                Forgot your password?
              </p>
              <p
                onClick={() =>
                  setCurrentState(
                    currentState === "Login" ? "Sign Up" : "Login"
                  )
                }
                className="text-gray-600 hover:text-black cursor-pointer"
              >
                {currentState === "Login" ? "Create account" : "Login Here"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-primary transition-colors duration-200 relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  <span className="ml-2">
                    {currentState === "Login"
                      ? "Signing In"
                      : "Creating Account"}
                  </span>
                </div>
              ) : currentState === "Login" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
      <ErrorPopup message={errorPopup} onClose={() => setErrorPopup("")} />
    </div>
  );
};

export default Login;
