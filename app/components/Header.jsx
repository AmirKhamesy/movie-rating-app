"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFilm } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();
  const basepath = pathname.split("/")[1];
  const { data: session } = useSession();

  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Watch",
      href: "/watch",
    },
    {
      label: "Rate",
      href: "/rate",
    },
  ];

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          <FaFilm className="text-3xl" />
          <span className="text-xl font-bold">Movie Rating App</span>
        </Link>
        {session && (
          <nav>
            <ul className="flex space-x-6">
              {navItems.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className={`text-gray-600 hover:text-indigo-600 transition-colors duration-200 ${
                      basepath === link.href.split("/")[1]
                        ? "text-indigo-600 font-bold"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
