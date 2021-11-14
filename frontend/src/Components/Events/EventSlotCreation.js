import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import "./Events.css"
import deLocale from 'date-fns/locale/de';

const EventSlotCreation = () => {

    const [startTime, setstartTime] = useState("")
    const [endTime, setendTime] = useState("")

    return (
        <div className="eventSlotCreationContainer">
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                <TimePicker
                    label="Zeitslot Start"
                    value={startTime}
                    onChange={(newValue) => {
                        setstartTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <Spacer horizontal={30} />
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                <TimePicker
                    label="Zeitslot Ende"
                    value={endTime}
                    onChange={(newValue) => {
                        setendTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
    )
}

export default EventSlotCreation
