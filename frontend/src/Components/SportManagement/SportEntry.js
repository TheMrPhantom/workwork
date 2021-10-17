import { Button, Paper, TextField, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';


import "./SportManagement.css"
import { doPostRequest } from '../Common/StaticFunctions';

const SportEntry = ({ name, extraHours, sportsID, refresh }) => {

    const clickRemove = () => {
        doPostRequest("sports/" + sportsID + "/delete")
        refresh()
    }

    const changedTextValue = (value) => {
        if (value < 0) {
            alert("Zahl muss größer 0 sein")
            return
        }

        doPostRequest("sports/" + sportsID + "/workhours", { "minutes": value })
        refresh()
    }

    return (
        <Paper elevation={2} className="outterBoxSport">
            <div className="innerBoxSport">
                <Typography>{name}</Typography>
                <Spacer horizontal={30}></Spacer>
                <TextField label="Extra Arbeitsminuten" type="number" defaultValue={extraHours} onChange={(value) => changedTextValue(value.target.value)} />
            </div>
            <div>
                <Button onClick={() => clickRemove()}>
                    <IndeterminateCheckBoxIcon className="denyBackground" />
                </Button>
            </div>

        </Paper>
    )
}

export default SportEntry
