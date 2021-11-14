import { Typography } from '@material-ui/core'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import EventSlotCreation from './EventSlotCreation';
import deLocale from 'date-fns/locale/de';

const CreateEvent = () => {
    const [date, setdate] = useState("")


    return (
        <div>
            <Typography variant="h5">Event erstellen</Typography>
            <Spacer vertical={20} />
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                <DatePicker
                    label="Event Datum"
                    value={date}
                    onChange={(newValue) => {
                        setdate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <Spacer vertical={20} />
            <Typography variant="subtitle2">Zeitslot</Typography>
            <Spacer vertical={10} />
            <EventSlotCreation />
        </div>
    )
}

export default CreateEvent