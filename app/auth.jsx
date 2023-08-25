"use client";

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return <Button text="Sign In" func={signIn} />;
};

export const LogoutButton = () => {
  return <Button text="Sign Out" func={signOut} />;
};

const Button = ({ text, func }) => {
  return (
    <button
      className="bg-green-700 text-white p-3 cursor-pointer m-1"
      onClick={() => func()}
    >
      {text}
    </button>
  );
};
