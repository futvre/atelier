import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"ZOE ATELIER — Objects with a soul",description:"Sculptural plaster decor and future 3D printed objects."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="el"><body>{children}</body></html>}
