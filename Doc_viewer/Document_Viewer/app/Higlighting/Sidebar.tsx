"use client";
import { Drawer, Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";
interface Entity { 
  text: string; 
  type: string; 
  start: number; 
  end: number; 
  confidence: number; 
  context: string; 
}
  interface EntitySidebarProps { 
        open: boolean; 
        onClose: () => void; 
        entity: Entity | null; 
        entities: Entity[]; 
    }
export default function Sidebar({ open, onClose, entity, entities }: EntitySidebarProps) {
    if (!entity) return null;
    const relatedEntity = entities.filter((e) => e !== entity && (e.context === entity.context || Math.abs(e.start - entity.start) < 80 || e.type === entity.type));
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 350, p: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    {entity.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Type: {entity.type}
                </Typography>
                <Typography variant="body2" color="text.secondary"> Confidence: {(entity.confidence * 100).toFixed(1)}%
                </Typography> <Typography variant="body2" color="text.secondary"> Context: {entity.context}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                    All Related Entities
                </Typography>
                <List> {
                    relatedEntity.length === 0 && (<Typography variant="body2" color="text.secondary"> No related entities found. </Typography>)}
                    {relatedEntity.map((r, i) => (
                        <ListItem key={i} >
                            <ListItemText primary={r.text} secondary={`${r.type} • ${(r.confidence * 100).toFixed(1)}%`} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>


    )



}