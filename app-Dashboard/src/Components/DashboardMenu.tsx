import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InsightsIcon from "@mui/icons-material/Insights";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function DashBoardMenu({
  currentTab,
  setCurrentTab,
}: {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}) {
  const ListItems = [
    { text: "Process Stats", icon: <AssessmentIcon /> },
    { text: "Model Performance", icon: <InsightsIcon /> },
    { text: "Activity Tracking", icon: <NotificationsActiveIcon /> },
  ];

  const violet800 = "#5B21B6"; // Tailwind violet-800
  const violet700 = "#6D28D9"; // Tailwind violet-700
  const violet100 = "#EDE9FE"; // Tailwind violet-100

  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: 1,
        justifyContent: "space-between",
        bgcolor: "#F9FAFB", // gray-50 background
        borderRadius: 2,
      }}
    >
      <List dense>
        {ListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={currentTab === item.text}
              onClick={() => setCurrentTab(item.text)}
              sx={{
                mb: 1,
                borderRadius: 2,
                color: currentTab === item.text ? "#FFFFFF" : violet800,
                bgcolor: currentTab === item.text ? violet800 : "transparent",
                "&:hover": {
                  bgcolor: currentTab === item.text ? violet700 : violet100,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentTab === item.text ? "#FFFFFF" : violet800,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}