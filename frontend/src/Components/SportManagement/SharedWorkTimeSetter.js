import { InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HSFAlert from '../Common/HSFAlert'
import { doPostRequest, getAndStore } from '../Common/StaticFunctions'

const SharedWorkTimeSetter = () => {

    const [minutes, setminutes] = useState(0)
    const [messageOpen, setmessageOpen] = useState(false)
    const [messageText, setmessageText] = useState("")
    const [messageType, setmessageType] = useState("success")
    const [messageShort, setmessageShort] = useState("")

    useEffect(() => {
        getAndStore("workhours", setminutes)
    }, [])

    const setExtraHours = async (val) => {
        var newval = val
        if (val === "") {
            setminutes(0)
            newval = 0
        } else {
            newval = parseInt(newval)
            setminutes(newval)
        }
        const resp = await doPostRequest("workhours/change", newval)
        if (resp.code === 200) {
            setmessageType("success")
            setmessageText("Allgemeine Arbeitsstunden angepasst")
            setmessageShort(newval + " Minuten")
        } else {
            setmessageType("error")
            setmessageText("Allgemeine Arbeitsstunden konnten nicht aktualisiert werden")
        }
        setmessageOpen(true)
    }
    return (
        <div>
            <TextField
                variant="standard"
                type="number"
                value={minutes}
                InputProps={{
                    endAdornment: <InputAdornment position="start">Minuten</InputAdornment>,
                }}
                style={{ width: "200px" }}
                onChange={(value) => setExtraHours(value.target.value)}
            />
            <HSFAlert type={messageType} message={messageText} open={messageOpen} setOpen={setmessageOpen} short={messageShort} />
        </div>
    )
}

export default SharedWorkTimeSetter
