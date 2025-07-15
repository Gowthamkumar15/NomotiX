import axios from "axios";
import React, { useState } from "react";
import GoogleButton from "react-google-button";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zipCode", "country"].includes(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5001/api/auth/signup", {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address
      });
      console.log("Signup success:", response.data);
      alert("Signup successful!");
      window.location.href = "/"; // navigate to the dashboard or homepage
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message); // This will show "User already exists"
        } else {
            alert("An error occurred. Please try again.");
        }
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google Sign Up Clicked");
    // Integrate Firebase/Auth0/Google OAuth here
  };

  return (
    <div className="flex min-h-screen bg-[#fcf8f8] font-sans">
      <div className="max-w-4xl m-auto w-full p-6">
        <h2 className="text-center text-2xl font-bold text-[#1b0e0f] mb-6">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
          <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
          <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />

          <h3 className="text-lg font-bold mt-6">Address</h3>
          <Input label="Street" name="street" value={formData.address.street} onChange={handleChange} />
          <Input label="City" name="city" value={formData.address.city} onChange={handleChange} />
          <Input label="State" name="state" value={formData.address.state} onChange={handleChange} />
          <Input label="Zip Code" name="zipCode" value={formData.address.zipCode} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium text-[#1b0e0f] mb-1">Country</label>
            <select
              name="country"
              value={formData.address.country}
              onChange={handleChange}
              className="w-full h-14 px-4 rounded-xl border border-[#e7d0d1] bg-[#fcf8f8] text-[#1b0e0f] focus:outline-none focus:ring-0"
            >
              <option value="">Select your country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-secondary-200 text-white font-bold mt-6"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm font-medium text-[#1b0e0f] mb-3">Or sign up with</p>
          <div className="flex justify-center">
            <GoogleButton onClick={handleGoogleSignup} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1b0e0f] mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full h-14 px-4 rounded-xl border border-[#e7d0d1] bg-[#fcf8f8] text-[#1b0e0f] focus:outline-none focus:ring-0 placeholder-[#974e52]"
      />
    </div>
  );
}
