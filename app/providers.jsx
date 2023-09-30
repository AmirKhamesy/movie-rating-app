"use client";
import { SessionProvider } from "next-auth/react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const Providers = ({ children }) => {
  return window.location.pathname == "/public-list" ? (
    children
  ) : (
    <SessionProvider>
      <Header />
      {children}
      <Footer />
    </SessionProvider>
  );
};
