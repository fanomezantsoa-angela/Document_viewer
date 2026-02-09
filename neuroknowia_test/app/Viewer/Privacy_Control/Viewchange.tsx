export function changingMode(
  text: string, 
  entities: Entity[], 
  viewmode: ViewMode
): string { 
  
  if (viewmode === "full") { 
    return text; 
  } 
  
  if (viewmode === "redacted") { 
    let redactedText = text;
    
  
    const sortedEntities = [...entities].sort((a, b) => b.start - a.start);
    
    sortedEntities.forEach((entity) => {
   
      const before = redactedText.substring(0, entity.start);
      const after = redactedText.substring(entity.end);
      redactedText = before + "[REDACTED]" + after;
    });
    
    return redactedText; 
  } 
  
  if (viewmode === "summary") {
    const summaryEntities = entities.filter((e) => 
      ["MEDICAL_TERM", "AMOUNT", "DATE"].includes(e.type)
    ); 
    
    if (summaryEntities.length === 0) { 
      return "No key information found."; 
    } 
    
  
    const grouped: Record<string, Entity[]> = {};
    summaryEntities.forEach(e => {
      if (!grouped[e.type]) grouped[e.type] = [];
      grouped[e.type].push(e);
    });
    
    let summary = " DOCUMENT SUMMARY\n\n";
    
    Object.entries(grouped).forEach(([type, entities]) => {
      summary += `${type}:\n`;
      entities.forEach(e => summary += `  • ${e.text}\n`);
      summary += "\n";
    });
    
    return summary; 
  } 
  
  return text; 
}