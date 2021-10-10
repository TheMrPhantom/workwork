import { Fab, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import SportEntry from './SportEntry'
import SaveIcon from '@material-ui/icons/Save';
import AddSportEntry from './AddSportEntry';

const SportManagement = () => {
    return (
        <div>
            <Typography variant="h5">Sportarten</Typography>
            <Spacer vertical={20}/>
            <Spacer vertical={5}/>
            <SportEntry name="Agility" extraHours={2}/>
            <Spacer vertical={5}/>
            <SportEntry name="TurnierHunde" extraHours={1}/>
            <Spacer vertical={5}/>
            <SportEntry name="Rettungshunde" extraHours={0}/>
            <Spacer vertical={50}/>
            
            <Typography variant="h5">Sportart Hinzufügen</Typography>
            <Spacer vertical={5}/>
            <AddSportEntry />
            
            <Fab size="medium" variant="extended" className="fixedButton accept">
                <SaveIcon sx={{ mr: 1 }} />
                Speichern
            </Fab>
        </div>
    )
}

export default SportManagement
