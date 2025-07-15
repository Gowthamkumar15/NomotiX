import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form,{
        withCredentials: true
        });
      alert('Login successful');
        localStorage.setItem("user", JSON.stringify(res.data.user));
         localStorage.setItem("token", res.data.token); // if using JWT

      navigate('/');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    try {
      await api.post('/auth/google', {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      });
      navigate('/services');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative px-4 py-10 bg-beige mx-8 md:mx-0 shadow rounded-3xl sm:p-10 w-full max-w-md">
        <div className="text-black">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-extrabold" style={{ color: '#6B4226' }}>NOMOTIX</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="login" className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input
              id="login"
              type="email"
              name="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-white text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
            />

            <label htmlFor="password" className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-white text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
            />

            <div className="text-right mb-4">
              <a href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-400">Forgot Password?</a>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="py-2 px-4 bg-[#6B4226] hover:bg-[#4E2E1F] text-white w-full transition duration-200 text-center text-base font-semibold shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4226]"
            >
              Log in
            </button>
          </form>

          <div className="flex items-center my-6">
            <span className="flex-grow border-t border-gray-400"></span>
            <span className="mx-4 text-xs font-semibold text-gray-500">OR</span>
            <span className="flex-grow border-t border-gray-400"></span>
          </div>

          <div className="text-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert('Login Failed')}
            />
          </div>

          <div className="text-center">
            <a href="/signup" className="text-xs font-semibold text-gray-500 hover:text-gray-400">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );

}