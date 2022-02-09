import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import ActivateSports from './ActivateSports'
import Card from './Card'
import { doPostRequest, getAndStore } from '../Common/StaticFunctions'
import Cookies from 'js-cookie'
import PasswordCard from './PasswordCard'

const Settings = () => {
    const [member, setmember] = useState(null)
    const [sports, setsports] = useState([])
    const [refresh, setrefresh] = useState(false)
    const [theme, settheme] = useState(0)

    useEffect(() => {
        const memberID = Cookies.get("memberID")
        getAndStore("user/" + memberID, setmember)
        getAndStore("user/" + memberID + "/participantIn", setsports)
    }, [])

    useEffect(() => {
        const memberID = Cookies.get("memberID")
        doPostRequest("user/" + memberID + "/changeParticipation", sports)
    }, [sports])

    useEffect(() => {
        settheme(Cookies.get("theme") !== undefined ? Cookies.get("theme") : 0)
    }, [])

    const toggleRefresh = (value) => {
        setrefresh(!refresh)
    }

    const changeTheme = (value) => {
        Cookies.set("theme", value, { expires: 365 * 10, sameSite: "Strict" })
        settheme(value)
        window.location.reload()
    }

    return (
        <div>
            <Typography variant="h5">Persönliche Informationen</Typography>
            <Spacer vertical={20} />
            {member ? <Card firstname={member.firstname} lastname={member.lastname} mail={member.mail} /> : ""}
            <Spacer vertical={30} />
            <Typography variant="h5">Sicherheit</Typography>
            <Spacer vertical={20} />
            {member ? <PasswordCard memberID={member.id} /> : ""}
            <Spacer vertical={20} />
            <Typography variant="h5">Sparten</Typography>
            <ActivateSports memberID={Cookies.get("memberID")} sportListMember={sports} setsports={setsports} refresh={toggleRefresh} />
            <Spacer vertical={20} />
            <Typography variant="h5">Farbschema</Typography>
            <Spacer vertical={20} />
            <FormControl fullWidth>
                <InputLabel variant='outlined'>Theme</InputLabel>
                <Select
                    className="eventsInput"
                    variant='outlined'
                    label="Theme"
                    value={theme}
                    onChange={(value) => changeTheme(value.target.value)}
                >
                    <MenuItem value={0}>Normal</MenuItem>
                    <MenuItem value={1}>Darkmode 1</MenuItem>
                    <MenuItem value={2}>Darkmode 2</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}

export default Settings
