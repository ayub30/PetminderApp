import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useNavigate,Link,useLocation } from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import "./UserUI/User.css"
import { signOut } from 'firebase/auth';
import { auth } from "./firebase";

export default function Nav() {
    const Location = useLocation();
    const navigate = useNavigate();
    const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const Logout = () => {
    signOut(auth)
    navigate('/login')
  }

  const navigationItems = {
    '/': [
      //{ text: 'Become a Sitter', to: '/' },
      //{ text: 'Login', to: '/login' },
      //{ text: 'Admin', to: '/AdminUI' }

    ],
    '/UserUI': [
      { text: 'Dog Profiles', to: '/profiles' },
      { text: 'Sitter Map', to: '/UserUI' },
      { text: 'Home', to: '/' },
      { text: 'Report', to: '/report' }
    ] ,
    '/report': [
      { text: 'Dog Profiles', to: '/profiles' },
      { text: 'Sitter Map', to: '/UserUI' },
      { text: 'Home', to: '/' },
      { text: 'Report', to: '/report' }
    ],'/profiles': [
      { text: 'Dog Profiles', to: '/profiles' },
      { text: 'Sitter Map', to: '/UserUI' },
      { text: 'Home', to: '/' },
      { text: 'Report', to: '/report' }
    ]
      
    ,'/AdminUI': [
      { text: 'Admin', to: '/AdminUI' }
    
    ],'/SitterUI': [
      { text: 'Jobs', to: '/inbox' },
      { text: 'Home', to: '/' },
      { text: 'SitterMap', to: '/SitterUI' }
    ],
    
    
    'default': [
      { text: 'Home', to: '/' },
      { text: 'Admin', to: '/AdminUI' }
     // { text: 'Admin', to: '/AdminUI' }
    ]
  };

  const items = navigationItems[Location.pathname] || navigationItems['default'];
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor: "black"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 4 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PetMinder
          </Typography>
          <Button color="inherit" onClick={Logout}>{Location.pathname === '/' ? 'Login' : 'Logout'}</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isDrawerOpen} 
        onClose={toggleDrawer}
         
      >
        <Box
          sx={{ width: 250}}
          role="presentation"
          onClick={toggleDrawer} 
          onKeyDown={toggleDrawer} 
        >
          <List>
          {items.map(({ text, to }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton component={to ? Link : undefined} to={to}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
