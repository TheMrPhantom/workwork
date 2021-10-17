import { Fab, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import Request from '../Request/Request'
import ActivateSports from '../Settings/ActivateSports'
import Card from '../Settings/Card'
import SaveIcon from '@material-ui/icons/Save';
import MemberHistory from './MemberHistory'
import { getAndStore } from '../Common/StaticFunctions'

const MemberEdit = (props) => {
    const [participant, setparticipant] = useState([])
    const [trainer, settrainer] = useState([])
    const [member, setmember] = useState(null)
    const [refresh, setrefresh] = useState(false)

    useEffect(() => {
        getAndStore("user/" + props.match.params.id + "/participantIn", setparticipant)
        getAndStore("user/" + props.match.params.id + "/trainerIn", settrainer)
        getAndStore("user/" + props.match.params.id, setmember)
        
    }, [props.match.params.id,refresh])

    const toggleReload = async () => {
        setrefresh(!refresh)
    }


    return (
        <div>
            <Request />
            <Spacer vertical={50} />
            <Typography variant="h5">Informationen</Typography>
            <Spacer vertical={20} />
            {member ? <Card firstname={member.firstname} lastname={member.lastname} mail={member.mail} /> : ""}
            <ActivateSports memberID={props.match.params.id} sportList={participant} firstColumn="Teilnehmer" setsports={setparticipant} refresh={toggleReload} />
            <ActivateSports memberID={props.match.params.id} sportList={trainer} firstColumn="Trainer" setsports={settrainer} refresh={toggleReload} />
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
