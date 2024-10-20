"use client";
import { SessionProvider, useSession } from "next-auth/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const LoadingAnimation = () => (
  <div className="flex justify-center items-center h-screen">
    <motion.div
      className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const AuthenticatedLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <LoadingAnimation />;
  }

  const isPublicList = pathname.startsWith("/public-list/");
  const showFooter = session && !isPublicList;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      {children}
      {showFooter && <Footer />}
    </motion.div>
  );
};

export const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SessionProvider>
  );
};
