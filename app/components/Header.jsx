"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const basepath = pathname.split("/")[1]; 

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
    <div>
      <ul className="flex gap-5 py-10">
        {navItems.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className={
                basepath === link.href.split("/")[1]
                  ? "text-blue-500 font-bold"
                  : ""
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Header;
