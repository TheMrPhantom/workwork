import React, { useEffect, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Paper, Select } from '@material-ui/core'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import Spacer from '../Common/Spacer';
import TextField from '@material-ui/core/TextField';
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';

import "./AddWork.css"
import "./Request.css"
import AskForTrainer from '../Request/AskForTrainer';
const AddWork = ({ memberID, refresh }) => {
    const [selectorValue, setselectorValue] = useState("")
    const [reason, setreason] = useState("")
    const [minutes, setminutes] = useState(0)
    const [sportNames, setsportNames] = useState([])
    const [canDisplayWarning, setcanDisplayWarning] = useState(false)
    const [dialogOpen, setdialogOpen] = useState(false)

    useEffect(() => {
        getAndStore("sports/names/membership/" + memberID, (sports) => { setsportNames(sports); setcanDisplayWarning(true) })
    }, [memberID, refresh])


    const addWork = async (trainer) => {
        if (selectorValue === "") {
            alert("Sportart auswählen")
            return
        }
        if (reason === "") {
            alert("Arbeit eintragen")
            return
        }
        if (minutes === 0) {
            alert("Mehr als 0 Minuten eintragen")
            return
        }
        if (selectorValue === 0 && trainer === undefined) {
            setdialogOpen(true)
            return
        }
        if (trainer == null) {
            await doPostRequest("request/create", { "memberID": memberID, "sportID": selectorValue, "description": reason, "minutes": minutes })
        } else {
            setdialogOpen(false)
            await doPostRequest("request/create", { "memberID": memberID, "sportID": selectorValue, "description": reason, "minutes": minutes, "trainer": trainer })
        }
        setselectorValue("")
        setreason("")
        setminutes(0)
    }

    const addWorkPossible = () => {
        return (
            <Paper elevation={2} className="requestBox">

                <div className="outterFlex">
                    <div className="innerFlex fullWidth">
                        <FormControl className="selectBox">
                            <InputLabel id="selectSportRequest-label">Sportart</InputLabel>
                            <Select
                                labelId="selectSportRequest-label"
                                id="selectSportRequest"
                                value={selectorValue}
                                label="sport"
                                onChange={(value) => setselectorValue(value.target.value)}
                            >

                                {sportNames.map((value) => { return <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem> })}
                                <MenuItem key={0} value={0}>Andere Sparte</MenuItem>

                            </Select>
                        </FormControl>
                        <Spacer horizontal={10} />
                        <TextField className="reasonBox" label="Begründung" type="input" value={reason} onChange={(value) => setreason(value.target.value)} />
                        <Spacer horizontal={10} />
                        <TextField className="workTimeBox" label="Zeit in Minuten" type="number" value={minutes} onChange={(value) => setminutes(value.target.value)} />
                    </div>
                    <Spacer horizontal={5} />
                    <AskForTrainer
                        confirmText="Anfrage Stellen"
                        addFunction={addWork}
                        open={dialogOpen}
                        setOpen={setdialogOpen}
                    />
                    <div>
                        <Button className="accept" onClick={() => addWork()}>
                            <AddBoxIcon />
                        </Button>
                    </div>
                </div>
            </Paper>
        )
    }
    const addWorkNotPossible = () => {
        if (canDisplayWarning) {
            return <div className="sportWarning">Noch keinen Sportarten beigetreten (trage dich in den Einstellungen für Sparten ein)</div>
        } else {
            return ""
        }
    }

    return sportNames.length > 0 ? addWorkPossible() : addWorkNotPossible();

}

export default AddWork
