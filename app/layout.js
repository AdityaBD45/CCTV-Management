import './globals.css';

export const metadata = {
  title: 'SecureSight Dashboard',
  description: 'CCTV monitoring and incident management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
