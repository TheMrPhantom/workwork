import { Fab, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import Request from '../Request/Request'
import ActivateSports from '../Settings/ActivateSports'
import Card from '../Settings/Card'
import SaveIcon from '@material-ui/icons/Save';
import MemberHistory from './MemberHistory'
import { getAndStore } from '../Common/StaticFunctions'

const MemberEdit = () => {
    const [participant, setparticipant] = useState([])
    const [trainer, settrainer] = useState([])
    const [member, setmember] = useState(null)
    useEffect(() => {
        getAndStore("user/3/participantIn",setparticipant)
        getAndStore("user/3/trainerIn",settrainer)
        getAndStore("user/3",setmember)       
    }, [])

    return (
        <div>
            <Request />
            <Spacer vertical={50} />
            <Typography variant="h5">Informationen</Typography>
            <Spacer vertical={20} />
            {member?<Card firstname={member.firstname} lastname={member.lastname} mail={member.mail}/>:""}
            <ActivateSports sportList={participant} firstColumn="Teilnehmer"/>
            <ActivateSports sportList={trainer} firstColumn="Trainer"/>
            <Spacer vertical={50} />
            <Typography variant="h5">Arbeitsstunden</Typography>
            <MemberHistory />
            <Spacer vertical={50} />
            <Fab size="medium" variant="extended" className="fixedButton accept">
                <SaveIcon sx={{ mr: 1 }} />
                Speichern
            </Fab>
            
        </div>
    )
}

export default MemberEdit
