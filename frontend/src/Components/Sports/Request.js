import React, { useState } from 'react'
import { Paper, Typography } from '@material-ui/core'
import { Button } from '@material-ui/core'

import "./Request.css"
import { doPostRequest } from '../Common/StaticFunctions'
import ConfirmDialog from '../Common/ConfirmDialog'

const Request = ({ name, work, amount, id, refresh }) => {

    const [confirmAccept, setconfirmAccept] = useState(false);
    const [confirmDeny, setconfirmDeny] = useState(false);

    const accept = () => {
        doPostRequest("request/" + id + "/accept")
        setconfirmAccept(false)
        refresh(true)
    }

    const deny = () => {
        doPostRequest("request/" + id + "/deny")
        setconfirmDeny(false)
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
                <div className="requestButtonFlex">
                    <ConfirmDialog
                        title="Anfrage ablehnen?"
                        open={confirmDeny}
                        setOpen={setconfirmDeny}
                        onConfirm={() => deny()}
                        buttonText="Ablehnen" />
                    <ConfirmDialog
                        title="Anfrage akzeptieren?"
                        open={confirmAccept}
                        setOpen={setconfirmAccept}
                        onConfirm={() => accept()}
                        buttonText="Annehmen"
                        isPositive={true} />
                    <Button className="deny border" onClick={() => setconfirmDeny(true)}>Ablehnen</Button>
                    <Button className="accept" onClick={() => setconfirmAccept(true)}>Annehmen</Button>

                </div>
            </div>
        </Paper>
    )
}

export default Request
