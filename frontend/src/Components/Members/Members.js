import { TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import MemberEntry from './MemberEntry'
import { getAndStore } from '../Common/StaticFunctions'

const Members = () => {
    const [members, setmembers] = useState([])

    useEffect(() => {
        getAndStore("members",setmembers)
    }, [])

    return (
        <div>
            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10} />
            <TextField className="reasonBox" label="Suche" type="input" />
            <Spacer vertical={20} />
            {members.map((value)=>{
                return <div><MemberEntry name={value.firstname+" "+value.lastname} currentWork={value.currentWork} maxWork={value.maxWork} /> <Spacer vertical={2} /></div>
            })}
        </div>
    )
}

export default Members
