import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZOE ATELIER — Objects with a soul",
  description: "Χειροποίητα γύψινα διακοσμητικά και μελλοντικές 3D δημιουργίες."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}
