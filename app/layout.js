import Header from "./components/Header";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata = {
  title: "Movie rating app",
  description: "Rate and discover movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 ">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
