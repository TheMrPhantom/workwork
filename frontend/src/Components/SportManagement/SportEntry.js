import { Button, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';


import "./SportManagement.css"
import { doPostRequest } from '../Common/StaticFunctions';
import HSFAlert from '../Common/HSFAlert';
import ConfirmDialog from '../Common/ConfirmDialog';

const SportEntry = ({ name, extraHours, sportsID, refresh }) => {

    const [open, setopen] = useState(false)
    const [openConfirm, setopenConfirm] = useState(false);

    const clickRemove = async () => {
        await doPostRequest("sports/" + sportsID + "/delete")
        refresh()
    }

    const changedTextValue = (value) => {
        if (value < 0) {
            setopen(true)
            return
        }

        doPostRequest("sports/" + sportsID + "/workhours", { "minutes": value })
    }

    return (
        <Paper elevation={2} className="outterBoxSport">
            <div className="innerBoxSportLeft">
                <Typography>{name}</Typography>
                <Spacer horizontal={30}></Spacer>
                <TextField variant="standard" label="Extra Arbeitsminuten" type="number" defaultValue={extraHours} onChange={(value) => changedTextValue(value.target.value)} />
            </div>
            <div className="innerBoxSportRight">
                <Button onClick={() => setopenConfirm(true)}>
                    <IndeterminateCheckBoxIcon className="denyBackground" />
                </Button>
            </div>
            <ConfirmDialog title="Sparte löschen?" open={openConfirm} setOpen={setopenConfirm} onConfirm={() => clickRemove()} />
            <HSFAlert message="Zahl muss größer 0 sein" short="Bitte Feld korrekt ausfüllen" open={open} setOpen={setopen} />
        </Paper>
    )
}

export default SportEntry
