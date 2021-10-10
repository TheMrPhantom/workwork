import { Fab, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import ActivateSports from './ActivateSports'
import Card from './Card'
import SaveIcon from '@material-ui/icons/Save';
import { getAndStore } from '../Common/StaticFunctions'

const Settings = () => {
const [member, setmember] = useState(null)
const [sports, setsports] = useState([])
useEffect(() => {
    getAndStore("user/3",setmember)
    getAndStore("user/3/participantIn",setsports)
}, [])
    return (
        <div>
            <Typography variant="h5">Visitenkarte</Typography>
            <Spacer vertical={20} />
            {member?<Card firstname={member.firstname} lastname={member.lastname} mail={member.mail}/>:""}
            <Spacer vertical={20} />
            <Typography variant="h5">Sparten</Typography>
            <ActivateSports firstColumn="Teilnehmer" sportList={sports}/>
            <Fab size="medium" variant="extended" className="fixedButton accept">
                <SaveIcon sx={{ mr: 1 }} />
                Speichern
            </Fab>
            
        </div>
    )
}

export default Settings
