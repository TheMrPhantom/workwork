import { Fab, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import Request from '../Request/Request'
import ActivateSports from '../Settings/ActivateSports'
import Card from '../Settings/Card'
import SaveIcon from '@material-ui/icons/Save';
import MemberHistory from './MemberHistory'

const MemberEdit = () => {
    return (
        <div>
            <Request />
            <Spacer vertical={50} />
            <Typography variant="h5">Informationen</Typography>
            <Spacer vertical={20} />
            <Card />
            <ActivateSports />
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
