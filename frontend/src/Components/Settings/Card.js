import { Paper, TextField } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import "./Settings.css"

const Card = ({ firstname, lastname, mail }) => {
    return (
        <Paper id="settingsBox">
            <div className="cardFloat">
                <TextField label="Vorname" type="input" defaultValue={firstname} />
                <Spacer horizontal={10} />
                <TextField label="Nachname" type="input" defaultValue={lastname} />
            </div>
            <Spacer vertical={20} />
            <div className="cardFloat">
                <TextField label="Email-Adresse" type="input" defaultValue={mail} />
            </div>
        </Paper>
    )
}

export default Card
