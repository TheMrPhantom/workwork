import * as React from 'react';
import { useCallback } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';


import Config from "./environment.json";
import BuildNumber from "./BuildNumber.json";
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Overview from './Components/Overview/Overview';
import Sports from './Components/Sports/Sports';
import { useLocation } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Request from './Components/Request/Request';
import Members from './Components/Members/Members';
import SportManagement from './Components/SportManagement/SportManagement';
import Settings from './Components/Settings/Settings';
import MemberEdit from './Components/Members/MemberEdit';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Spacer from './Components/Common/Spacer';
import { doGetRequest, getAndStore } from './Components/Common/StaticFunctions';
import { useEffect, useState } from 'react'
import Login from './Components/Login/Login';
import Header from './Components/Header/Header';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EventIcon from '@mui/icons-material/Event';
import LoginIcon from '@mui/icons-material/Login';
import DownloadIcon from '@mui/icons-material/Download';

import "./index.css"
import EventList from './Components/Events/EventList';
import CreateEvent from './Components/Events/CreateEvent';
import DownloadOverview from './Components/Downloads/DownloadOverview';
import SystemSettings from './Components/SystemSettings/SystemSettings';
import Privacy from './Components/Privacy/Privacy';
import { ListItemIcon, ListItemText } from '@mui/material';

const drawerWidth = 210;

export default function ClippedDrawer() {

    const history = useHistory();
    const theme = useTheme();
    const [open, setOpen] = React.useState(window.innerWidth > Config.COMPACT_SIZE_THRESHOLD);
    const [afterLoginRedirect, setafterLoginRedirect] = useState(null);
    const [memberState, setmemberState] = useState(0)
    const [sports, setsports] = useState([])
    const location = useLocation()

    const redirect = useCallback((url) => {
        history.push(url);
        if (window.innerWidth < Config.COMPACT_SIZE_THRESHOLD) {
            setOpen(false);
        }
    }, [history])

    const loginLoad = useCallback((memberStateFromLogin = null) => {
        getAndStore("sports/names/associated", setsports)
        if (memberStateFromLogin === null) {
            getAndStore("memberstate", setmemberState)
        } else {
            setmemberState(memberStateFromLogin.memberstate)
        }
        if (location.pathname === "/login" || location.pathname === "/") {
            if (afterLoginRedirect !== null) {
                redirect(afterLoginRedirect)
                setafterLoginRedirect(null)
                return
            }
            if (memberState > 0 && memberState < 2) {
                //Member
                redirect(Config.MEMBER_LANDINGPAGE)
            } else if (memberState < 3) {
                //Trainer
                redirect(Config.TRAINER_LANDINGPAGE)
            } else {
                //Executive
                redirect(Config.EXECUTIVE_LANDINGPAGE)
            }
        }

    }, [redirect, afterLoginRedirect, location.pathname, memberState])

    useEffect(() => {
        const checkLogin = async () => {
            if (location.pathname !== "/login" && location.pathname !== "/") {
                setafterLoginRedirect(location.pathname)
            }
            const resp = await doGetRequest("login/check")
            if (resp.code === 200) {
                loginLoad()
            } else if (resp.code === 403) {
                if (location.pathname !== "/privacy") {
                    redirect("/login")
                    setsports([])
                    setmemberState(0)
                }
            }
        }
        checkLogin()
        getAndStore("sports/names/associated", setsports)
    }, [loginLoad, redirect, location.pathname])

    const toggleRefresh = () => {
        getAndStore("sports/names/associated", setsports)
    }


    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
        width: drawerWidth,
    }));

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const logout = () => {
        setsports([])
        setmemberState(0)
        redirect("/login")
    }

    const buildSportsList = () => {
        if (sports.length > 0) {
            return (<div>
                <List>
                    {sports.map((value) => {
                        return <div key={value.id}>
                            <ListItem button key={value.id} onClick={() => redirect("/sport/" + value.id)}>
                                <ListItemIcon>
                                    <PetsIcon />
                                </ListItemIcon>
                                <ListItemText primary={value.name} />
                            </ListItem>
                        </div>
                    })}
                </List>
                <Divider />
            </div>)
        }
    }

    const buildNormalUserView = () => {
        if (memberState === 0) {
            return
        }
        const overview = <ListItem button key="0" onClick={() => redirect("/overview")}>
            <ListItemIcon>
                <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Übersicht" />
        </ListItem>

        const addWork = <ListItem button key="0" onClick={() => redirect("/request")}>
            <ListItemIcon>
                <PetsIcon />
            </ListItemIcon>
            <ListItemText primary="Arbeit Eintragen" />
        </ListItem>
        const output = <div><List>{overview}{memberState === 1 ? addWork : ""}</List><Divider /></div>
        return output
    }

    const buildExecutiveList = () => {
        if (memberState > 3) {
            return (<div>
                <List>
                    <ListItem button key="0" onClick={() => redirect("/members")}>
                        <ListItemIcon>
                            <PlaylistAddCheckIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mitglieder" />
                    </ListItem>
                    <ListItem button key="0" onClick={() => redirect("/downloads")}>
                        <ListItemIcon>
                            <DownloadIcon />
                        </ListItemIcon>
                        <ListItemText primary="Downloads" />
                    </ListItem>
                    <ListItem button key="1" onClick={() => redirect("/sport/admin")}>
                        <ListItemIcon>
                            <PetsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sportarten" />
                    </ListItem>
                    <ListItem button key="1" onClick={() => redirect("/system/settings")}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="System" />
                    </ListItem>
                </List>
                <Divider />
            </div>)
        }
    }

    const buildSettings = () => {
        if (memberState === 0) {
            return
        }
        return (
            <List>
                <ListItem button key="0" onClick={() => redirect("/settings")}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Einstellungen" />
                </ListItem>
            </List>
        )
    }

    const buildEventSettings = () => {
        if (memberState === 0) {
            return
        }
        return (
            <div>
                <List>
                    <ListItem button key="0" onClick={() => redirect("/events")}>
                        <ListItemIcon>
                            <EventIcon />
                        </ListItemIcon>
                        <ListItemText primary="Events" />
                    </ListItem>
                </List>
                <Divider />
            </div>
        )
    }

    const buildLogin = () => {
        if (memberState !== 0) {
            return
        }
        return (
            <List>
                <ListItem button key="0" onClick={() => redirect("/login")}>
                    <ListItemIcon>
                        <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                </ListItem>
            </List>
        )
    }

    const mainCSSClass = () => {
        if (location.pathname === "/login") {
            return "mainLoginFlex"
        } else if (location.pathname === "/login") {
            return "mainFlex"
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {open ? <Spacer horizontal={drawerWidth} /> : ""}
                    <Header logoutRoutine={logout} />

                </Toolbar>
            </AppBar>

            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader style={{
                    display: "flex", flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <Typography variant="h6" style={{ marginLeft: "10px" }}>Menü</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Box sx={{ overflow: 'auto' }}>
                    {buildNormalUserView()}
                    {buildEventSettings()}
                    {buildSportsList()}
                    {buildExecutiveList()}
                    {buildSettings()}
                    {buildLogin()}
                </Box>
                <Typography variant="caption" className="versionNumber">
                    Version {Config.VERSION} (Build {BuildNumber})
                </Typography>
            </Drawer>
            {open ? <Spacer horizontal={drawerWidth} /> : ""}

            <Box component="main" sx={{ flexGrow: 1, p: 3, paddingLeft: open ? "40px" : "" }} className={mainCSSClass()}>
                <Toolbar />
                <Route path="/login" component={() => <Login redirect={loginLoad} />} />
                <Route path="/overview" component={Overview} />
                <Route exact path="/events" component={EventList} />
                <Route exact path="/events/:id([0-9]*)" component={EventList} />
                <Route exact path="/events/create" component={CreateEvent} />
                <Route path="/request" component={Request} />
                <Switch>
                    <Route path="/sport/admin" component={() => <SportManagement refreshDrawer={toggleRefresh} />} />
                    <Route path="/sport/:id" component={Sports} />
                </Switch>
                <Route path="/downloads" component={DownloadOverview} />
                <Switch>
                    <Route exact path="/members" component={Members} />
                    <Route path="/members/edit/:id" component={MemberEdit} />
                </Switch>
                <Route path="/system/settings" component={SystemSettings} />
                <Route path="/settings" component={Settings} />
                <Route exact path="/privacy" component={Privacy} />
            </Box>
        </Box>
    );
}
