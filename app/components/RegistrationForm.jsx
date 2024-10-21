"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (loginRes.ok) {
          window.location.href = "/";
        } else {
          console.error("User registration login failed.");
        }
      } else {
        console.error("User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration: ", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-[10vh]">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-cinema-blue-light p-8 rounded-lg shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-cinema-blue dark:text-cinema-gold">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400 dark:text-gray-300" />
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cinema-gold dark:focus:ring-cinema-gold bg-white dark:bg-cinema-blue text-cinema-blue dark:text-white"
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400 dark:text-gray-300" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cinema-gold dark:focus:ring-cinema-gold bg-white dark:bg-cinema-blue text-cinema-blue dark:text-white"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400 dark:text-gray-300" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cinema-gold dark:focus:ring-cinema-gold bg-white dark:bg-cinema-blue text-cinema-blue dark:text-white"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-cinema-gold text-cinema-blue dark:bg-cinema-blue dark:text-cinema-gold font-bold py-2 px-4 rounded-md hover:bg-cinema-gold-dark dark:hover:bg-cinema-blue-light transition duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold dark:focus:ring-offset-cinema-blue"
          >
            <FaUserPlus className="mr-2" />
            Register
          </motion.button>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500 text-white text-sm py-2 px-3 rounded-md mt-2 text-center"
            >
              {error}
            </motion.div>
          )}
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link href="/" className="text-cinema-gold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
