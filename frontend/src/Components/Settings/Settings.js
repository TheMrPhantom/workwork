import { Fab, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import ActivateSports from './ActivateSports'
import Card from './Card'
import SaveIcon from '@material-ui/icons/Save';

const Settings = () => {
    return (
        <div>
            <Typography variant="h5">Visitenkarte</Typography>
            <Spacer vertical={20} />
            <Card />
            <Spacer vertical={20} />
            <Typography variant="h5">Sparten</Typography>
            <ActivateSports />
            <Fab size="medium" variant="extended" className="fixedButton accept">
                <SaveIcon sx={{ mr: 1 }} />
                Speichern
            </Fab>
            
        </div>
    )
}

export default Settings
