import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
