import { Button, Paper, TextField } from '@material-ui/core'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import { doPostRequest } from '../Common/StaticFunctions'
import "./Settings.css"

const Card = ({ firstname, lastname, mail }) => {

    const [pw, setpw] = useState("")
    const [pwconfirm, setpwconfirm] = useState("")

    const changeAttribute = (value, attribute) => {
        const memberID = Cookies.get("memberID")
        doPostRequest("member/" + memberID + "/change/" + attribute, value)
    }

    const setNewPassword = () => {
        if (pw === "" || pwconfirm === "") {
            alert("Passwort darf nicht leer sein!")
        }
        if (pw.length < 8) {
            alert("Passwort muss mindestens 8 Zeichen lang sein")
        }
        if (pw !== pwconfirm) {
            alert("Passwörter stimmen nicht überein")
        }
        doPostRequest("member/" + Cookies.get("memberID") + "/change/password", { "newPassword": pw })
        setpw("")
        setpwconfirm("")
    }

    return (
        <Paper id="settingsBox">
            <div className="horizontalFloat">
                <div>
                    <div className="cardFloat">
                        <TextField label="Vorname" type="input" defaultValue={firstname} onChange={(value) => changeAttribute(value.target.value, "firstname")} />
                        <Spacer horizontal={10} />
                        <TextField label="Nachname" type="input" defaultValue={lastname} onChange={(value) => changeAttribute(value.target.value, "lastname")} />
                    </div>
                    <Spacer vertical={20} />
                    <div className="cardFloat">
                        <TextField label="Email-Adresse" type="input" defaultValue={mail} onChange={(value) => changeAttribute(value.target.value, "email")} />
                    </div>
                </div>
                <div className="verticalFloat">
                    <TextField label="Neues Passwort" type="password" value={pw} onChange={(value) => setpw(value.target.value)} />
                    <Spacer vertical={20} />
                    <TextField label="Passwort Bestätigen" type="password" value={pwconfirm} onChange={(value) => setpwconfirm(value.target.value)} />
                    <Spacer vertical={20} />
                    <Button className="setPasswordButton" onClick={() => setNewPassword()}>
                        Passwort Setzen
                    </Button>
                </div>
            </div>
        </Paper>
    )
}

export default Card
