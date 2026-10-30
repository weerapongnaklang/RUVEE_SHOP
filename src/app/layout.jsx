import "../styles/globals.css";

export const metadata = {
  title: "RUVEE Shop",
  description: "RUVEE Shop - Your fashion destination",
  icons: {
    icon: "/favicon/favicon_ruvee.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
