import "./globals.css";
import { Inter, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", inter.variable, robotoHeading.variable)} suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" >
        {/* Navbar */}
        {children}

        {/* Footer */}
        </body>
    </html>
  );
}
