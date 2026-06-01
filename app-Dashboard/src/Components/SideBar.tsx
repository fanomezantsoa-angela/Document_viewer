import Box from '@mui/material/Box';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import DashBoardMenu from './DashboardMenu';
export default function SideBar({currentTab, setCurrentTab}: {currentTab: string, setCurrentTab: (tab: string) => void}){
    const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});
    return(
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
         <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <DashBoardMenu currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </Box>
    </Drawer>




    )


}