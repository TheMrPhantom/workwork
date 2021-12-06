import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import { Button } from '@material-ui/core'

import "./Request.css"
import { doPostRequest } from '../Common/StaticFunctions'

const Request = ({ name, work, amount, id, refresh }) => {
    const accept = () => {
        doPostRequest("request/" + id + "/accept")
        refresh(true)
    }

    const deny = () => {
        doPostRequest("request/" + id + "/deny")
        refresh(true)
    }

    return (
        <Paper elevation={2} className="requestBox">
            <div className="outterFlex">
                <div className="innerFlex">
                    <Typography className="border">{name}</Typography>
                    <Typography className="border">-</Typography>
                    <Typography className="border">{work}</Typography>
                    <Typography className="border">-</Typography>
                    <Typography>{amount + " min"}</Typography>
                </div>
                <div>
                    <Button className="deny border" onClick={() => deny()}>Ablehnen</Button>
                    <Button className="accept" onClick={() => accept()}>Annehmen</Button>
                </div>
            </div>
        </Paper>
    )
}

export default Request
