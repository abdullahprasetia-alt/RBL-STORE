export const metadata = {
  title: "Rebellion Store",
  description: "GTA RP Black Market Store"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
