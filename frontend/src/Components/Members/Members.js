import { TextField, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import MemberEntry from './MemberEntry'

const Members = () => {
    return (
        <div>
            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10} />
            <TextField className="reasonBox" label="Suche" type="input" />
            <Spacer vertical={20} />
            <MemberEntry name="Alice" currentWork={10} maxWork={12}/>
            <Spacer vertical={2}/>
            <MemberEntry name="Bob" currentWork={10} maxWork={12}/>
            <Spacer vertical={2}/>
            <MemberEntry name="Eve" currentWork={10} maxWork={12}/>
            
        </div>
    )
}

export default Members
