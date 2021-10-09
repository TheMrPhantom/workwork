import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { Button } from '@material-ui/core'

import "./Request.css"

const Request = ({ name, work }) => {
    return (
        <Paper elevation={2} className="requestBox">
            <div className="outterFlex">
                <div className="innerFlex">
                    <Typography className="border">{name}</Typography>
                    <Typography className="border">-</Typography>
                    <Typography>{work}</Typography>
                </div>
                <div>
                    <Button className="deny border">Ablehnen</Button>
                    <Button className="accept">Annehmen</Button>
                </div>
            </div>
        </Paper>
    )
}

export default Request
