import { Paper, TextField } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import "./Settings.css"

const Card = () => {
    return (
        <Paper id="settingsBox">
            <div className="cardFloat">
                <TextField label="Vorname" type="input" defaultValue="Alice"/>
                <Spacer horizontal={10} />
                <TextField label="Nachname" type="input" defaultValue="Evil"/>
            </div>
            <Spacer vertical={20} />
            <div className="cardFloat">
                <TextField label="Email-Adresse" type="input" defaultValue="alice.evil@bob.de"/>
            </div>
        </Paper>
    )
}

export default Card
