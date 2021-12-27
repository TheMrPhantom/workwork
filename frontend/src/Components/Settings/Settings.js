import { Typography } from '@material-ui/core'
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

    useEffect(() => {
        const memberID = Cookies.get("memberID")
        getAndStore("user/" + memberID, setmember)
        getAndStore("user/" + memberID + "/participantIn", setsports)
    }, [])

    useEffect(() => {
        const memberID = Cookies.get("memberID")
        doPostRequest("user/" + memberID + "/changeParticipation", sports)
    }, [sports])

    const toggleRefresh = (value) => {
        setrefresh(!refresh)
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
        </div>
    )
}

export default Settings
