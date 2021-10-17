import { Button, LinearProgress, Paper, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from "react-router-dom";
import "./MemberEntry.css"

const MemberEntry = ({ name, currentWork, maxWork, hasWorkHours }) => {
    
    const history=useHistory();
    
    const calcProgress = () => {
        return (currentWork / maxWork) * 100
    }
    return (
        <Paper elevation={2} className="outterBoxMember">
            <div className="innerFlexMember">
                <Typography>{name}</Typography>
                {hasWorkHours?<Spacer horizontal={20} />:""}
                {hasWorkHours?<LinearProgress variant="determinate" value={calcProgress()} style={{ width: "50%" }} />:""}
                {hasWorkHours?<Spacer horizontal={20} />:""}
                {hasWorkHours?<Typography>{currentWork}/{maxWork}</Typography>:""}
            </div>
            <div>
                <Button onClick={()=>history.push('/members/edit/5')}>
                    <EditIcon />
                </Button>
            </div>
        </Paper>
    )
}

export default MemberEntry
