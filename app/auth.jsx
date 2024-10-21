"use client";

import { signIn, signOut } from "next-auth/react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export const LoginButton = () => {
  return <Button text="Sign In" icon={<FaSignInAlt />} func={signIn} />;
};

export const LogoutButton = () => {
  return <Button text="Sign Out" icon={<FaSignOutAlt />} func={signOut} />;
};

const Button = ({ text, icon, func }) => {
  return (
    <button
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-cinema-blue bg-cinema-gold hover:bg-cinema-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold dark:text-white dark:bg-cinema-blue-light dark:hover:bg-cinema-blue dark:focus:ring-cinema-gold transition-colors duration-200"
      onClick={() => func()}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};
