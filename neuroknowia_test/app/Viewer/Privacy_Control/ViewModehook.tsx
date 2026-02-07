"use client"
import { useEffect, useState } from "react"
export function UseViewMode(){
    const [viewMode, setViewMode]=useState<ViewMode>("full")
    useEffect(()=>{
        const savedmode = localStorage.getItem("viewmode")
        if(savedmode) setViewMode(savedmode as ViewMode)

    }, [])
    function updateviewmode(m: ViewMode){
        setViewMode(m)
        localStorage.set("viewmode", viewMode)
    }
    return{viewMode, setViewMode: updateviewmode}
  



}