import './globals.css'

export const metadata = {
  title: 'Stegastamp',
  description: 'Invisible Hyperlinks in Physical Photographs',
  icons: '/favicon.png'
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
      <body>{children}</body>
    </html>
  )
}
