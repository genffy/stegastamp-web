import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stegastamp',
  description: 'Invisible Hyperlinks in Physical Photographs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* TODO */}
      <head>
        <link rel="stylesheet" href="css/bootstrap.min.css" />
        <link rel="stylesheet" href="css/fontawesome.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
