import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import AssessmentIcon from "@mui/icons-material/Assessment";
import InsightsIcon from "@mui/icons-material/Insights";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
export default function DashBoardMenu(){
    const ListItems = [
  { text: 'Process Stats', icon: <AssessmentIcon /> },
  { text: 'Model Performence', icon: <InsightsIcon /> },
  { text: 'Activity tracks', icon: <NotificationsActiveIcon /> },
 
];
    return(
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>

      <List dense>
        {ListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </Stack>
    )
}