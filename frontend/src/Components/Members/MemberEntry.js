import { Button, LinearProgress, Paper, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from "react-router-dom";
import "./MemberEntry.css"

const MemberEntry = ({ name, currentWork, maxWork, isTrainer }) => {
    
    const history=useHistory();
    
    const calcProgress = () => {
        return (currentWork / maxWork) * 100
    }
    return (
        <Paper elevation={2} className="outterBoxMember">
            <div className="innerFlexMember">
                <Typography>{name}</Typography>
                {!isTrainer?<Spacer horizontal={20} />:""}
                {!isTrainer?<LinearProgress variant="determinate" value={calcProgress()} style={{ width: "50%" }} />:""}
                {!isTrainer?<Spacer horizontal={20} />:""}
                {!isTrainer?<Typography>{currentWork}/{maxWork}</Typography>:""}
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
