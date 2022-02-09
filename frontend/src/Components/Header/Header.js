import { Button, Typography } from '@mui/material'
import React from 'react'
import Config from "../../environment.json";
import "./Header.css"
import LogoutIcon from '@mui/icons-material/Logout';
import Spacer from '../Common/Spacer';
import { doPostRequest } from '../Common/StaticFunctions';
import { Route, Switch } from 'react-router-dom';

const Header = ({ logoutRoutine }) => {

    const logout = async () => {
        await doPostRequest("logout")
        logoutRoutine()
    }
    return (
        <div className="headerFlex">
            <Typography variant="h6" noWrap component="div">
                {Config.ORGA_NAME} - {window.innerWidth > Config.COMPACT_SIZE_THRESHOLD ? "Arbeisstunden Management System" : "AMS"}
            </Typography>
            <Switch>
                <Route exact path="/login"></Route>
                <Route path="/">
                    <Button style={{ borderColor: '#595959' }} onClick={() => logout()} variant="outlined">
                        <LogoutIcon /> <Spacer horizontal={10} /> <Typography> Logout</Typography>
                    </Button>
                </Route>
            </Switch>
        </div>
    )
}

export default Header
