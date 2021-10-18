import { Button, Paper, TextField } from '@material-ui/core'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import { doPostRequest } from '../Common/StaticFunctions'
import "./Settings.css"

const Card = ({ firstname, lastname, mail, memberID }) => {

    const [pw, setpw] = useState("")
    const [pwconfirm, setpwconfirm] = useState("")
    const [isPwError, setisPwError] = useState(false)
    const [pwErrorText, setpwErrorText] = useState("")

    useEffect(() => {
        if (pw === "" && pwconfirm === "") {
            setisPwError(false)
            setpwErrorText("")
            return
        }
        setisPwError(true)
        if (pw.length < 8) {
            setpwErrorText("Mindestens 8 Zeichen")
            return
        }
        if (pw !== pwconfirm) {
            setpwErrorText("Passwörter stimmen nicht überein")
            return
        }
        setisPwError(false)
        setpwErrorText("")
    }, [pw, pwconfirm])

    const changeAttribute = (value, attribute) => {
        const mID = memberID !== undefined ? memberID : Cookies.get("memberID")
        doPostRequest("member/" + mID + "/change/" + attribute, value)
    }

    const setNewPassword = () => {
        if (pw === "" || pwconfirm === "") {
            alert("Passwort darf nicht leer sein!")
            return
        }
        if (pw.length < 8) {
            alert("Passwort muss mindestens 8 Zeichen lang sein")
            return
        }
        if (pw !== pwconfirm) {
            alert("Passwörter stimmen nicht überein")
            return
        }
        const mID = memberID !== undefined ? memberID : Cookies.get("memberID")
        doPostRequest("member/" + mID + "/change/password", { "newPassword": pw })
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
                    <TextField error={isPwError} helperText={pwErrorText} label="Neues Passwort" type="password" value={pw} onChange={(value) => setpw(value.target.value)} />
                    <Spacer vertical={20} />
                    <TextField label="Passwort Bestätigen" type="password" value={pwconfirm} onChange={(value) => setpwconfirm(value.target.value)} />
                    <Spacer vertical={20} />
                    <Button onClick={() => setNewPassword()} variant="outlined">
                        Passwort Setzen
                    </Button>
                </div>
            </div>
        </Paper>
    )
}

export default Card
