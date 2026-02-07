"use client";
import { Button } from "@mui/material";
export default function DocumentViewHeader(
{  pageNumber, zoom, ZoomIn, ZoomOut }: DocumentViewHeaderProps){


    return(
           <div className="flex flex-row  items-center justify-center justify-items-center">
             
        
<div className="flex flex-row  items-center justify-center justify-items-center">
  <Button  onClick={ZoomOut}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>




        </Button>
             
        <div className="font-semibold">
          {Math.round(zoom * 100)}%
        </div>
       
        
        <Button onClick={ZoomIn} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>


        </Button>
        </div>
         <div className=" text-center font-bold ml-12">
           {pageNumber}
          </div>
          </div>
             


      
    )
}