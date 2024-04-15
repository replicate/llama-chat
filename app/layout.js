import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

export const metdata = {
  title: "Llama Chat - Powered by Replicate",
  openGraph: {
    title: "Llama Chat - Powered by Replicate",
    description: "I can explain concepts, write poems and code, solve logic puzzles, or even name your pets.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Llama Chat - Powered by Replicate</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦙</text></svg>"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
