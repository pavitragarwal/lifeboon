import "./globals.css";

export const metadata = {
  title: "LifeBoon - Healthcare Services",
  description: "Find healthcare services near you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}