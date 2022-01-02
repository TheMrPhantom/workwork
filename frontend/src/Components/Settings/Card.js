import { Paper, TextField } from '@material-ui/core'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import HSFAlert from '../Common/HSFAlert'
import Spacer from '../Common/Spacer'
import { doPostRequest } from '../Common/StaticFunctions'
import "./Settings.css"

const Card = ({ firstname, lastname, mail, memberID }) => {

    const [sucMessage, setsucMessage] = useState("")
    const [sucOpen, setsucOpen] = useState(false)

    const changeAttribute = async (value, attribute) => {
        const mID = memberID !== undefined ? memberID : Cookies.get("memberID")
        var sendvalue = value
        if (attribute === "email") {
            sendvalue = value.toLocaleLowerCase()
        }
        const resp = await doPostRequest("member/" + mID + "/change/" + attribute, sendvalue)
        if (resp.code === 200) {
            setsucMessage("Erfolgreich '" + value + "' gespeichert")
            setsucOpen(true)
        }
    }


    return (
        <Paper className="settingsBox">
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
            </div>

            <HSFAlert type="success" message={sucMessage} open={sucOpen} setOpen={setsucOpen} />
        </Paper>
    )
}

export default Card
