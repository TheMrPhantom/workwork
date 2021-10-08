import * as React from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Config from "./environment.json";

import PetsIcon from '@material-ui/icons/Pets';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import Overview from './Components/Overview/Overview';
import { Route } from 'react-router-dom';

const drawerWidth = 200;

export default function ClippedDrawer() {

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" style={{ zIndex: 2 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {Config.ORGA_NAME} - WorkWork
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
                style={{ zIndex: 1, width: drawerWidth }}
            >
                <Toolbar style={{ width: drawerWidth }} />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button key="0">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Übersicht" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key="0">
                            <ListItemIcon>
                                <PetsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Agility" />
                        </ListItem>
                        <ListItem button key="0">
                            <ListItemIcon>
                                <PetsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Rettungshunde" />
                        </ListItem>
                        <ListItem button key="0">
                            <ListItemIcon>
                                <PetsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Obedience" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key="0">
                            <ListItemIcon>
                                <PlaylistAddCheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Mitglieder" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key="0">
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Einstellungen" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Route path="/overview" component={Overview} />
            </Box>
        </Box>
    );
}
