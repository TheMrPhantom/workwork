import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import LinearProgress from '@material-ui/core/LinearProgress';
import Spacer from '../Common/Spacer';

import "./Member.css";
import "./Request.css"

const Member = ({ name, currentWork, maxWork, isTrainer }) => {

    const calcProgress = () => {
        return (currentWork / maxWork) * 100
    }

    return (
        <Paper elevation={2} className="requestBox">
            <div className="outterFlex">
                <div className="innerFlex fullWidth">
                    <Typography className="border">{name}</Typography>
                    <Spacer horizontal={20} />
                    {!isTrainer ? <LinearProgress variant="determinate" value={calcProgress()} style={{ width: "50%" }} /> : ""}
                    {!isTrainer ? <Spacer horizontal={20} /> : ""}
                    {!isTrainer ? <Typography>{currentWork}/{maxWork}</Typography> : ""}
                </div>
                <Spacer horizontal={5} />
                {!isTrainer ?
                <div>
                    <Button className="accept">
                        <AddBoxIcon />
                    </Button>
                </div>:""}
            </div>
        </Paper>
    )
}

export default Member
