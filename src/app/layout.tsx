import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Figma Make App',
  description: 'Manage your personal and financial goals effortlessly with a sleek dashboard that tracks tasks, budgets, and progress in a modern, user-friendly interface.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
