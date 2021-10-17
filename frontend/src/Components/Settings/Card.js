import { Paper, TextField } from '@material-ui/core'
import Cookies from 'js-cookie'
import React from 'react'
import Spacer from '../Common/Spacer'
import { doPostRequest } from '../Common/StaticFunctions'
import "./Settings.css"

const Card = ({ firstname, lastname, mail }) => {

    const changeAttribute = (value, attribute) => {
        const memberID = Cookies.get("memberID")
        doPostRequest("member/" + memberID + "/change/" + attribute, value)
    }

    return (
        <Paper id="settingsBox">
            <div className="cardFloat">
                <TextField label="Vorname" type="input" defaultValue={firstname} onChange={(value) => changeAttribute(value.target.value,"firstname")} />
                <Spacer horizontal={10} />
                <TextField label="Nachname" type="input" defaultValue={lastname} onChange={(value) => changeAttribute(value.target.value,"lastname")} />
            </div>
            <Spacer vertical={20} />
            <div className="cardFloat">
                <TextField label="Email-Adresse" type="input" defaultValue={mail} onChange={(value) => changeAttribute(value.target.value,"email")} />
            </div>
        </Paper>
    )
}

export default Card
