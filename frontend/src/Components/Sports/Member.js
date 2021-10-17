import React, { useState } from 'react'
import { Paper, Typography } from '@material-ui/core'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import LinearProgress from '@material-ui/core/LinearProgress';
import ClearIcon from '@mui/icons-material/Clear';
import Spacer from '../Common/Spacer';
import AddWork from './AddWork';

import "./Member.css";
import "./Request.css"


const Member = ({ name, currentWork, maxWork, isTrainer, id }) => {

    const [addIsOpen, setaddIsOpen] = useState(false)

    const calcProgress = () => {
        return (currentWork / maxWork) * 100
    }

    const buttonClick = () => {
        setaddIsOpen(!addIsOpen)
    }

    const displayAddDialog = () => {
        if (addIsOpen) {
            return (<div>
                <Spacer vertical={15} />
                <AddWork memberID={id} />
            </div>
            )
        }
    }

    const displayButton = () => {
        if (!isTrainer) {
            if (!addIsOpen) {
                return (
                    <Button className="accept" onClick={() => buttonClick()}>
                        <AddBoxIcon />
                    </Button>
                )
            } else {
                return (
                    <Button className="close" onClick={() => buttonClick()}>
                        <ClearIcon />
                    </Button>
                )
            }
        }
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
                {displayButton()}
            </div>
            {displayAddDialog()}
        </Paper>
    )
}

export default Member
