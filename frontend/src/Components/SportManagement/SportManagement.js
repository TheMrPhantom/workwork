import { Fab, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import SportEntry from './SportEntry'
import SaveIcon from '@material-ui/icons/Save';
import AddSportEntry from './AddSportEntry';
import { getAndStore } from '../Common/StaticFunctions';

const SportManagement = () => {
    const [sports, setsports] = useState([])
    useEffect(() => {
        getAndStore("sports/names", setsports)
    }, [])
    return (
        <div>
            <Typography variant="h5">Sportarten</Typography>
            <Spacer vertical={20} />
            {sports.map((value) => {
                return <div>
                    <Spacer vertical={5} />
                    <SportEntry name={value.name} extraHours={value.extraHours} />
                </div>
            })}
            <Spacer vertical={50} />

            <Typography variant="h5">Sportart Hinzufügen</Typography>
            <Spacer vertical={5} />
            <AddSportEntry />

            <Fab size="medium" variant="extended" className="fixedButton accept">
                <SaveIcon sx={{ mr: 1 }} />
                Speichern
            </Fab>
        </div>
    )
}

export default SportManagement
