import { useEffect, useState, useMemo } from "react"; 
import { Paper, Typography, Select, MenuItem, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info"; 
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; 
import WarningIcon from "@mui/icons-material/Warning"; 
import ErrorIcon from "@mui/icons-material/Error";

type EventType = "info" | "success" | "warning" | "error";
 interface EventActivity { 
    id: number; 
    type: EventType; 
    timestamp: string; 
    message: string; 
}
export default function Activity(){
const[events, setEvents]=useState<EventActivity[]>([]);
const[ActionFilter, setActionfilter]=useState<"all" | EventType>("all");
 function MockDatageneration(): EventActivity { 
    const types: EventType[] = ["info", "success", "warning", "error"]; 
    const type = types[Math.floor(Math.random() * types.length)]; 
    const messages = { 
    info: `Document "Contract_${Math.floor(Math.random() * 999)}.pdf" uploaded by Alice (Legal)`, 
    success: `Extraction completed for "Medical_Report_${Math.floor(Math.random() * 99)}.pdf" (${Math.floor(Math.random() * 40)} entities found)`, 
    warning: `Privacy check flagged "Invoice_${Math.floor(Math.random() * 999)}.pdf" (${Math.floor(Math.random() * 5)} PII instances)`, 
    error: `Processing failed for "Scan_${Math.floor(Math.random() * 999)}.jpg" (OCR error)` }; 
    return { 
        id: Date.now(),
         type, 
        timestamp: new Date().toLocaleTimeString([], 
        { hour: "2-digit", minute: "2-digit" }), 
        message: messages[type] }; 
    }
    useEffect(()=>{
        const refreshInterval = setInterval(()=>{
            setEvents(prev=>{
                const updatedEvent = [MockDatageneration(), ...prev];
                return updatedEvent.slice(0, 50);
            })
            }, 5000)
            return ()=>clearInterval(refreshInterval)
        }, [])
         const filteredEvents = useMemo(() => { 
            if (ActionFilter === "all") return events; 
            return events.filter(e => e.type === ActionFilter); 
        }, [events, ActionFilter]);
         const icons = { 
            info: <InfoIcon sx={{ color: "blue" }} />, 
         success: <CheckCircleIcon sx={{ color: "green" }} />,
          warning: <WarningIcon sx={{ color: "orange" }} />, 
          error: <ErrorIcon sx={{ color: "red" }} /> 
        };

        return(
             <Paper sx={{ p: 3, height: "70vh", overflowY: "auto", borderRadius: 2 }}> 
             <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}> 
                <Typography variant="h6">Recent Activity</Typography> 
                <Select size="small" value={ActionFilter} onChange={(e) => setActionfilter(e.target.value as any)} > 
                    <MenuItem value="all">All</MenuItem> 
                    <MenuItem value="info">Uploads</MenuItem> 
                    <MenuItem value="success">Success</MenuItem> 
                    <MenuItem value="warning">Warnings</MenuItem> 
                    <MenuItem value="error">Errors</MenuItem> 
                    </Select> 
                    </Box> {filteredEvents.map(event => ( <Box key={event.id} sx={{ display: "flex", gap: 1, mb: 2, p: 1, borderRadius: 1, backgroundColor: "#f9f9f9" }} > 
                        <Typography>{icons[event.type]}</Typography> 
                        <Typography sx={{ fontWeight: 600 }}>[{event.timestamp}]</Typography> 
                        <Typography>{event.message}</Typography> 
                        </Box> ))} 
                        {filteredEvents.length === 0 && ( 
                            <Typography sx={{ mt: 4, textAlign: "center", color: "gray" }}> No activity yet </Typography> )} 
                        </Paper>



        )
    


}