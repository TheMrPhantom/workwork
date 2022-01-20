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
import { secureRandomNumber } from '../Common/StaticFunctions';

const EventSlotCreation = ({ createNewSlot }) => {

    const [name, setname] = useState("")
    const [startTime, setstartTime] = useState(null)
    const [endTime, setendTime] = useState(null)
    const [helper, sethelper] = useState(0)

    const formatTime = (time) => {
        const timeWithSeconds = String(time).split(" ")[4];
        const timeWithoutSeconds = timeWithSeconds.substring(0, timeWithSeconds.length - 3)
        return timeWithoutSeconds
    }

    const addSlot = () => {
        if (name !== "" && startTime !== null && endTime !== null && helper != null && helper > 0 && startTime < endTime) {
            setname("")
            setstartTime(null)
            setendTime(null)
            sethelper(0)
            createNewSlot(name, helper, formatTime(startTime), formatTime(endTime), secureRandomNumber())
        } else {

        }
    }


    return (
        <div className="eventSlotCreationContainer">
            <div>
                <TextField value={name} className="eventsInput" type="text" variant="outlined" label="Schichtname" error={name === ""} onChange={(value) => setname(value.target.value)} />
                <Spacer vertical={30} />
            </div>
            <Spacer horizontal={30} />
            <div>
                <TextField className="eventsInput" value={helper} type="number" variant="outlined" label="Helfer Benötigt" error={helper === null || helper < 1} onChange={(value) => sethelper(value.target.value)} />
                <Spacer vertical={30} />
            </div>
            <Spacer horizontal={30} />
            <div>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                    <TimePicker
                        label="Schicht Start"
                        value={startTime}
                        onChange={(newValue) => {
                            setstartTime(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} className="eventsInput" error={startTime > endTime || startTime === null} />}
                    />
                </LocalizationProvider>
                <Spacer vertical={30} />
            </div>
            <Spacer horizontal={30} />
            <div>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                    <TimePicker
                        label="Schicht Ende"
                        value={endTime}
                        onChange={(newValue) => {
                            setendTime(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} className="eventsInput" error={startTime > endTime || endTime === null} />}
                    />
                </LocalizationProvider>
                <Spacer vertical={30} />
            </div>
            <Spacer horizontal={30} />

            <Button className="accept" onClick={() => addSlot()} style={{ height: "56px" }}>
                <AddBoxIcon />
            </Button>

        </div>
    )
}

export default EventSlotCreation
