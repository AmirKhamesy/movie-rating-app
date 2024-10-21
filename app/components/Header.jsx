"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFilm, FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <header className="bg-white dark:bg-cinema-blue">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 text-cinema-blue dark:text-cinema-gold hover:text-cinema-blue-light dark:hover:text-cinema-gold-dark transition-colors duration-300"
          >
            <FaFilm className="text-4xl animate-pulse" />
            <span className="text-2xl font-bold tracking-wider">CineRate</span>
          </Link>
          {session && (
            <>
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  {navItems.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className={`relative px-3 py-2 rounded-md transition-all duration-300 ${
                          basepath === link.href.split("/")[1]
                            ? "text-cinema-gold dark:text-cinema-gold font-bold"
                            : "text-cinema-blue dark:text-white hover:text-cinema-blue-light dark:hover:text-cinema-gold-dark hover:bg-gray-100 dark:hover:bg-cinema-blue-light"
                        }`}
                      >
                        {link.label}
                        {basepath === link.href.split("/")[1] && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cinema-gold transform origin-left scale-x-100 transition-transform duration-300"></span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <button
                className="md:hidden text-cinema-blue dark:text-cinema-gold"
                onClick={toggleDrawer}
              >
                <FaBars className="text-2xl" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-cinema-blue-light shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4">
              <button
                className="text-cinema-blue dark:text-cinema-gold mb-4"
                onClick={toggleDrawer}
              >
                <FaTimes className="text-2xl" />
              </button>
              <ul className="space-y-4">
                {navItems.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className={`block px-3 py-2 rounded-md transition-all duration-300 ${
                        basepath === link.href.split("/")[1]
                          ? "text-cinema-gold font-bold"
                          : "text-cinema-blue dark:text-white hover:text-cinema-blue-light dark:hover:text-cinema-gold-dark hover:bg-gray-100 dark:hover:bg-cinema-blue"
                      }`}
                      onClick={toggleDrawer}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
