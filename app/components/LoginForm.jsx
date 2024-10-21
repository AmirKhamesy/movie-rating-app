"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-[15vh] ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-cinema-blue-light p-8 rounded-lg shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-cinema-blue dark:text-cinema-gold">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <FaSignInAlt className="mr-2" />
            Login
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
          Don't have an account?{" "}
          <Link href="/register" className="text-cinema-gold hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
