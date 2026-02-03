
import "./globals.css";
import Link from 'next/link'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
        
     
        <html lang="en">
      <body>
       <nav className="flex items-center justify-center justify-items-center mt-6" >
        <Link className="text-violet-600 text-xl font-medium mr-2" href="/Upload">Upload</Link>
        <Link className="text-violet-600 text-xl font-medium mr-2" href="/Analyses">Document analyses</Link>
       </nav>
      {children}
      </body>
    </html>
    
  );
}
