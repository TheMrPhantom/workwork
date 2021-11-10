import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import SportEntry from './SportEntry'
import AddSportEntry from './AddSportEntry';
import { getAndStore } from '../Common/StaticFunctions';
import SharedWorkTimeSetter from './SharedWorkTimeSetter';
import { Paper } from '@mui/material';

const SportManagement = () => {
    const [sports, setsports] = useState([])
    const [refresh, setrefresh] = useState(false)
    useEffect(() => {
        getAndStore("sports/names", setsports)
        setrefresh(false)
    }, [refresh])

    return (
        <div>
            <Paper style={{ padding: "10px" }} elevation={2}>
                <Typography variant="h5">Allgemeinde Arbeitsstunden</Typography>
                <Spacer vertical={5} />
                <SharedWorkTimeSetter />
            </Paper>
            <Spacer vertical={20} />
            <Paper style={{ padding: "10px" }} elevation={2}>
                {sports.length > 0 ? <div>
                    <Typography variant="h5">Sportarten</Typography>
                    <Spacer vertical={20} />
                    {sports.map((value) => {
                        if (value.id === 1) {
                            return ""
                        }
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
            </Paper>
        </div>
    )
}

export default SportManagement
