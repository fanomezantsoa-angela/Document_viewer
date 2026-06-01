
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
       <div className="w-full flex items-center justify-between px-6 py-4"> 
          <Link className="text-violet-800 text-xl font-medium " href="/"><h1 className="text-3xl text-violet-800 font-bold"> NeuroKnowAI </h1> </Link>
          <nav className="flex items-center space-x-6 mr-96">
             <Link className="text-violet-800 text-xl font-medium" href="/Upload"> Upload </Link> 
             <Link className="text-violet-800 text-xl font-medium " href="/Dashboard"> Dashboard </Link> 
             </nav> 
             </div>
             {children}
             
      </body>
    </html>
    
  );
}
