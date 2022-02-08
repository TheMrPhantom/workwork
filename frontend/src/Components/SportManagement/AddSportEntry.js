import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { doPostRequest } from '../Common/StaticFunctions';
import HSFAlert from '../Common/HSFAlert';

const AddSportEntry = ({ refresh }) => {

    const [name, setname] = useState("")
    const [extraHours, setextraHours] = useState(0)
    const [open, setopen] = useState(false)
    const [message, setmessage] = useState("")

    const addSport = async () => {
        if (name === "") {
            setmessage("Bitte name ausfüllen")
            setopen(true)
            return
        } else if (extraHours < 0) {
            setmessage("Zahl muss größer 0 sein")
            setopen(true)
            return
        }

        setname("")
        setextraHours(0)
        await doPostRequest("sports/add", { "name": name, "extraHours": extraHours })
        refresh()
    }

    return (
        <div className="outterAddBoxSport">
            <div className="innerBoxSportLeft">
                <TextField label="Name" type="input" value={name} onChange={(value) => setname(value.target.value)} />
                <Spacer horizontal={30}></Spacer>
                <TextField label="Extra Arbeitsminuten" type="number" value={extraHours} onChange={(value) => setextraHours(value.target.value)} />
            </div>
            <div>
                <Button onClick={() => addSport()}>
                    <AddBoxIcon className="successBackground" />
                </Button>
            </div>
            <HSFAlert message={message} short="Bitte Felder korrekt ausfüllen" open={open} setOpen={setopen} />
        </div>
    )
}

export default AddSportEntry
