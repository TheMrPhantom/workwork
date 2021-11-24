import { Button, Paper, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import "./Events.css"

const EventTimeSlot = ({ slotName, start, end, currentHelper, maxHelper,onDelete }) => {
    return (
        <Paper elevation={2} className="timeslotPaper">
            
                <div>
                    <Typography variant="caption">Schichtname</Typography>
                    <Typography>{slotName}</Typography>
                </div><div className="timeslotPaperInner">
                <Spacer horizontal={40} />
                <div>
                    <Typography variant="caption">Schicht beginn</Typography>
                    <Typography>{start}</Typography>
                </div>
                <Spacer horizontal={25} />
                <div>
                    <Typography variant="caption">Schicht ende</Typography>
                    <Typography>{end}</Typography>
                </div>
                <Spacer horizontal={25} />
                <div>
                    <Typography variant="caption"> Anzahl Helfer</Typography>
                    <Typography>{currentHelper}/{maxHelper}</Typography>
                </div>
                <Spacer horizontal={10} />
            <Button onClick={()=>onDelete()}>
                <IndeterminateCheckBoxIcon className="denyBackground" />
            </Button></div>

        </Paper>
    )
}

export default EventTimeSlot
