import { Button, Typography } from '@material-ui/core'
import React from 'react'
import Config from "../../environment.json";
import "./Header.css"
import LogoutIcon from '@mui/icons-material/Logout';
import Spacer from '../Common/Spacer';
import { doPostRequest } from '../Common/StaticFunctions';

const Header = ({logoutRoutine}) => {

    const logout = async()=>{
        await doPostRequest("logout")
        logoutRoutine()
    }
    return (
        <div className="headerFlex">
            <Typography variant="h6" noWrap component="div">
                {Config.ORGA_NAME} - WorkWork
            </Typography>
            <Button onClick={()=>logout()}>
                <LogoutIcon /> <Spacer horizontal={10}/> <Typography> Logout</Typography>
            </Button>
        </div>
    )
}

export default Header
