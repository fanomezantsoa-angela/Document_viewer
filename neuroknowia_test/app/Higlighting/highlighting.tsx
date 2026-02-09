export   function HighlightedSegments(text: string, entities: Entity[]) {
    const segments: Array<{ text: string; entity?: Entity }> = [];
    let lastIndex = 0;

    const sortedEntities = [...entities].sort((a, b) => a.start - b.start);

    for (const entity of sortedEntities) {
   
      if (entity.start > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, entity.start)
        });
      }

  
      segments.push({
        text: text.substring(entity.start, entity.end),
        entity: entity
      });

      lastIndex = entity.end;
    }

 
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex)
      });
    }
     

    return segments;
   
  }