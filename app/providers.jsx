"use client";
import { SessionProvider } from "next-auth/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

export const Providers = ({ children }) => {
  return usePathname() == "/public-list" ? (
    children
  ) : (
    <SessionProvider>
      <Header />
      {children}
      <Footer />
    </SessionProvider>
  );
};
