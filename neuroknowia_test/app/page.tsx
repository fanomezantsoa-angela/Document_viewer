"use client"
import { useRouter } from "next/navigation";
import { useDocumentStore } from "../app/stores/documentStore";

import { div } from "framer-motion/client";
 

export default function Home() {
   const router = useRouter();
  const setFile= useDocumentStore((state) => state.setFilePath);

  const Demoredirection = (filetype: string, file: string) => {
    setFile(file); 
    console.log(fifil)
    router.push(`/Viewer?mode=${filetype}`);
  };
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      

     
      <div className="flex flex-col md:flex-row items-center justify-center gap-2  w-full">
        
     
        <div className="w-full  flex justify-center">
          <img
  src="/Photo2.jpg"
  alt="Document preview"
  className="w-full max-w-3xl h-[550px] object-cover rounded-2xl shadow-2xl border border-violet-200"
/>

        </div>

     
        <div className="w-full md:w-1/2 text-left">
        <h1 className="text-5xl font-extrabold text-violet-800 mb-4">
        Upload your documents Securely
      </h1>
      <h1 className="text-5xl font-bold text-violet-800 mb-10">
        View them with full functionality
      </h1>
          <p className="text-violet-700 text-lg font-medium mb-2">
            Fast, accurate and secure document Viewer for businesses
          </p>
          <p className="text-violet-700 text-lg font-medium">
            And individual. We help you to read your document efficiently
          </p>
         
        </div>
        

      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">

         <button         onClick={() => Demoredirection("txt", "/demo.txt")}
  className="px-6 py-3 rounded-full border border-violet-900 bg-violet-800 text-white font-semibold hover:bg-violet-700 transition mt-8">
          Text Viewer Demo
          </button>
            <button  onClick={() => Demoredirection("md", "/demo.md")}  className="px-6 py-3 rounded-full border border-violet-900 bg-violet-800 text-white font-semibold hover:bg-violet-700 transition mt-8">
          Image to text Viewer Demo
          </button>
          <button className="px-6 py-3 rounded-full border border-violet-900 bg-violet-800 text-white font-semibold hover:bg-violet-700 transition mt-8">
            Markdown Viewer
          </button>
      </div>
    </div>
  );
}
