import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata = {
  title: "Movie rating app",
  description: "By Amir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="max-w-4xl mx-auto px-5">
          <Providers>
            <Header />

            {children}

            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
