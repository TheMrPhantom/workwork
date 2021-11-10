import { InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { doPostRequest, getAndStore } from '../Common/StaticFunctions'

const EditWorkHourOfUser = ({ memberID }) => {

    const [minutes, setminutes] = useState(0)
    useEffect(() => {
        getAndStore("member/" + memberID + "/extraHours", setminutes)
    }, [memberID])

    const setExtraHours = async (val) => {
        var newval = val
        if (val === "") {
            setminutes(0)
            newval = 0
        } else {
            setminutes(val)
        }
        console.log(newval)
        doPostRequest("member/" + memberID + "/change/extraHours", newval)
    }

    return (
        <TextField
            variant="standard"
            type="number"
            value={minutes}
            InputProps={{
                endAdornment: <InputAdornment position="start">Minuten</InputAdornment>,
            }}
            style={{ width: "350px" }}
            onChange={(value) => setExtraHours(value.target.value)}
        />
    )
}

export default EditWorkHourOfUser
