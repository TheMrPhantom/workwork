import React, { useEffect, useState } from 'react'
import HSFAlert from '../Common/HSFAlert'
import { Button, Divider, List, ListItem, ListItemText, Paper, TextField, Typography } from '@material-ui/core'
import Spacer from '../Common/Spacer'
import { doPostRequest } from '../Common/StaticFunctions'
import Cookies from 'js-cookie'
import Config from "../../environment.json"

const PasswordCard = ({ memberID }) => {

    const [open, setopen] = useState(false)
    const [pw, setpw] = useState("")
    const [pwconfirm, setpwconfirm] = useState("")
    const [isPwError, setisPwError] = useState(false)
    const [pwErrorText, setpwErrorText] = useState("")
    const [message, setmessage] = useState("")
    const [sucMessage, setsucMessage] = useState("")
    const [sucOpen, setsucOpen] = useState(false)

    const [triggerChars, settriggerChars] = useState(false)
    const [triggerMinChar, settriggerMinChar] = useState(false)
    const [triggerMinNum, settriggerMinNum] = useState(false)

    useEffect(() => {
        settriggerChars(false)
        settriggerMinChar(false)
        settriggerMinNum(false)
        setisPwError(false)
        setpwErrorText("")
        if (pw === "" && pwconfirm === "") {
            return
        }
        if (pw.length < 8) {
            settriggerChars(true)
        }
        if (!containsNumber(pw)) {
            settriggerMinNum(true)
        }
        if (!containsAlphabetic(pw)) {
            settriggerMinChar(true)
        }

        if (pw !== pwconfirm) {
            setisPwError(true)
            setpwErrorText("Passwörter stimmen nicht überein")
            return
        }

        setisPwError(false)
        setpwErrorText("")
    }, [pw, pwconfirm])


    const setNewPassword = () => {
        if (pw === "" || pwconfirm === "") {
            setmessage("Passwort darf nicht leer sein!")
            setopen(true)
            return
        }
        if (pw.length < 8) {
            setmessage("Passwort muss mindestens 8 Zeichen lang sein")
            setopen(true)
            return
        }
        if (!(containsNumber(pw) && containsAlphabetic(pw))) {
            setmessage("Passwort muss mindestens eine Zahl und einen Buchstaben enthalten")
            setopen(true)
            return
        }
        if (pw !== pwconfirm) {
            setmessage("Passwörter stimmen nicht überein")
            setopen(true)
            return
        }
        const mID = memberID !== undefined ? memberID : Cookies.get("memberID")
        doPostRequest("member/" + mID + "/change/password", { "newPassword": pw })
        setpw("")
        setpwconfirm("")
        setsucMessage("Passwort wurde erfolgreich gesetzt")
        setsucOpen(true)
    }

    const containsNumber = (input) => {
        return /\d/.test(input);
    }

    const containsAlphabetic = (input) => {
        return /[a-zA-Z]+/.test(input);
    }

    const triggerCharsColor = () => {
        if (pw === "" && pwconfirm === "") {
            return {}
        } else {
            return { color: (triggerChars ? "var(--errorColor)" : "green") }
        }
    }
    const triggerMinCharColor = () => {
        if (pw === "" && pwconfirm === "") {
            return {}
        } else {
            return { color: (triggerMinChar ? "var(--errorColor)" : "green") }
        }
    }
    const triggerMinNumColor = () => {
        if (pw === "" && pwconfirm === "") {
            return {}
        } else {
            return { color: (triggerMinNum ? "var(--errorColor)" : "green") }
        }
    }

    return (<Paper className={window.innerWidth > Config.COMPACT_SIZE_THRESHOLD ? "settingsBox horizontalFloat" : "settingsBox verticalFloat"}>
        <div className="verticalFloat">
            <TextField error={isPwError} helperText={pwErrorText} label="Neues Passwort" type="password" value={pw} onChange={(value) => setpw(value.target.value)} />
            <Spacer vertical={20} />
            <TextField label="Passwort Bestätigen" type="password" value={pwconfirm} onChange={(value) => setpwconfirm(value.target.value)} />
            <Spacer vertical={20} />
            <Button onClick={() => setNewPassword()} variant="outlined" >
                Passwort Setzen
            </Button>
            <HSFAlert message={message} short="Bitte Felder korrekt ausfüllen" open={open} setOpen={setopen} />
            <HSFAlert type="success" message={sucMessage} open={sucOpen} setOpen={setsucOpen} />
        </div>
        {window.innerWidth > Config.COMPACT_SIZE_THRESHOLD ? <Spacer horizontal={20} /> : <Spacer vertical={20} />}
        {window.innerWidth > Config.COMPACT_SIZE_THRESHOLD ? < Divider orientation="vertical" style={{ height: "200px" }} /> : ""}
        {window.innerWidth > Config.COMPACT_SIZE_THRESHOLD ? <Spacer horizontal={30} /> : ""}
        <div>

            <Typography variant="overline">Anforderungen:</Typography>
            <List>
                <ListItem style={triggerCharsColor()}>
                    <ListItemText primary="Mindestens 8 Zeichen" />
                </ListItem>
                <ListItem style={triggerMinCharColor()}>
                    <ListItemText primary="Mindestens einen Buchstaben" />
                </ListItem>
                <ListItem style={triggerMinNumColor()}>
                    <ListItemText primary="Mindestens eine Zahl" />
                </ListItem>

            </List>
        </div>
    </Paper>
    )
}

export default PasswordCard
