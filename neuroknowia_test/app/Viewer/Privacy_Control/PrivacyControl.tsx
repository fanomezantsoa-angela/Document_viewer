"use client"
import { div } from "framer-motion/client";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleButton from '@mui/material/ToggleButton';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"; 
import ShieldIcon from "@mui/icons-material/Shield";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { UseViewMode } from "./ViewModehook";
export default function PrivacyControl(){
    const {viewMode, setViewMode}=UseViewMode();
    function togglebetweenMode(event: React.MouseEvent<HTMLElement>, newmode: ViewMode){
        setViewMode(newmode)

    }
    return(
        <div>

    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={togglebetweenMode}
      aria-label="text alignment"
    >
      <ToggleButton value="full" aria-label="left aligned">
       <VisibilityIcon />
      </ToggleButton>
      <ToggleButton value="redacted" aria-label="centered">
        <VisibilityOffIcon/>
      </ToggleButton>
      <ToggleButton value="summary" aria-label="right aligned">
      <ShieldIcon/>
      </ToggleButton>
      
    </ToggleButtonGroup>
        </div>



    )

}