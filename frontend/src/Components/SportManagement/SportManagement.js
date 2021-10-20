import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import SportEntry from './SportEntry'
import AddSportEntry from './AddSportEntry';
import { getAndStore } from '../Common/StaticFunctions';

const SportManagement = () => {
    const [sports, setsports] = useState([])
    const [refresh, setrefresh] = useState(false)
    useEffect(() => {
        getAndStore("sports/names", setsports)
        setrefresh(false)
    }, [refresh])

    return (
        <div>
            {sports.length > 0 ? <div>
                <Typography variant="h5">Sportarten</Typography>
                <Spacer vertical={20} />
                {sports.map((value) => {
                    return <div key={value.id}>
                        <Spacer vertical={5} />
                        <SportEntry name={value.name} extraHours={value.extraHours} sportsID={value.id} refresh={setrefresh} />
                    </div>
                })}
                <Spacer vertical={50} />
            </div> : ""}
            <Typography variant="h5">Sportart Hinzufügen</Typography>
            <Spacer vertical={5} />
            <AddSportEntry refresh={setrefresh} />

        </div>
    )
}

export default SportManagement
