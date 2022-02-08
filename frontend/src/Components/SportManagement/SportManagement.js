import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import SportEntry from './SportEntry'
import AddSportEntry from './AddSportEntry';
import { getAndStore } from '../Common/StaticFunctions';

const SportManagement = ({ refreshDrawer }) => {
    const [sports, setsports] = useState([])

    useEffect(() => {
        getAndStore("sports/names", setsports)
    }, [])

    return (
        <div>
            {sports.length > 0 ? <div>
                <Typography variant="h5">Sportarten</Typography>
                <Spacer vertical={20} />
                {sports.map((value) => {
                    if (value.id === 1) {
                        return ""
                    }
                    return <div key={value.id}>
                        <Spacer vertical={5} />
                        <SportEntry name={value.name} extraHours={value.extraHours} sportsID={value.id} refresh={() => { refreshDrawer() }} />
                    </div>
                })}
                <Spacer vertical={50} />
            </div> : ""}
            <Typography variant="h5">Sportart Hinzufügen</Typography>
            <Spacer vertical={5} />
            <AddSportEntry refresh={() => { refreshDrawer() }} />
        </div>
    )
}

export default SportManagement
