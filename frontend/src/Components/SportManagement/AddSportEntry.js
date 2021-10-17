import { Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { doPostRequest } from '../Common/StaticFunctions';

const AddSportEntry = ({ refresh }) => {

    const [name, setname] = useState("")
    const [extraHours, setextraHours] = useState(0)

    const addSport = () => {
        if (name === "") {
            alert("Bitte name ausfüllen")
            return
        } else if (extraHours < 0) {
            alert("Zahl muss größer 0 sein")
            return
        }

        doPostRequest("sports/add", { "name": name, "extraHours": extraHours })
        setname("")
        setextraHours(0)
        refresh(true)
    }

    return (
        <div className="outterAddBoxSport">
            <div className="innerBoxSport">
                <TextField label="Name" type="input" value={name} onChange={(value) => setname(value.target.value)} />
                <Spacer horizontal={30}></Spacer>
                <TextField label="Extra Arbeitsminuten" type="number" value={extraHours} onChange={(value) => setextraHours(value.target.value)} />
            </div>
            <div>
                <Button onClick={() => addSport()}>
                    <AddBoxIcon className="successBackground" />
                </Button>
            </div>
        </div>
    )
}

export default AddSportEntry
