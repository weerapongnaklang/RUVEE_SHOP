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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
