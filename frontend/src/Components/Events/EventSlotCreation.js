import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import deLocale from 'date-fns/locale/de';
import { Button } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import "./Events.css"

const EventSlotCreation = ({ createNewEvent }) => {

    const [startTime, setstartTime] = useState("")
    const [endTime, setendTime] = useState("")
    const [helper, sethelper] = useState(null)

    const addSlot = () => {

    }

    return (
        <div className="eventSlotCreationContainer">
            <div>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                    <TimePicker
                        label="Zeitslot Start"
                        value={startTime}
                        onChange={(newValue) => {
                            setstartTime(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} className="eventsInput" />}
                    />
                </LocalizationProvider>
                <Spacer vertical={30} />
            </div>
            <Spacer horizontal={30} />
            <div>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                    <TimePicker
                        label="Zeitslot Ende"
                        value={endTime}
                        onChange={(newValue) => {
                            setendTime(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} className="eventsInput" />}
                    />
                </LocalizationProvider>
                <Spacer vertical={30} />
            </div>
            <Spacer horizontal={30} />
            <div>
                <TextField className="eventsInput" type="number" variant="outlined" label="Helfer Benötigt" error={helper === null || helper < 1} onChange={(value) => sethelper(value.target.value)} />
                <Spacer vertical={30} />
            </div>
            <Spacer horizontal={30} />
            <Button className="accept" onClick={() => addSlot()} style={{height:"56px"}}>
                <AddBoxIcon />
            </Button>

        </div>
    )
}

export default EventSlotCreation
