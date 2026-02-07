export function changingMode( text: string, entities: Entity[], viewmode: ViewMode ) { 
    if (viewmode === "full") { 
        return text; 
    } 
    if (viewmode === "redacted") { 
        let redactedText = text; 
        entities.forEach((e) => { 
            const safe = e.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");  
            const regex = new RegExp(safe, "gi"); 
            redactedText = redactedText.replace(regex, "[REDACTED]"); }); 
            return redactedText; 
        } 
        if (viewmode === "summary") {
             const summarytext = entities.filter((e) => ["MEDICAL", "LEGAL", "AMOUNT"].includes(e.type) ); 
             if (summarytext.length === 0) { 
                return "No summary text."; 
            } 
            return summarytext.map((e) => `• ${e.text}`).join("\n"); 
        } 
        return text; 
    }