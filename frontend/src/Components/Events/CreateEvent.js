import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import EventSlotCreation from './EventSlotCreation';
import deLocale from 'date-fns/locale/de';
import EventTimeSlot from './EventTimeSlot';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./Events.css"
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';

const CreateEvent = () => {
    const [date, setdate] = useState(null)
    const [eventName, seteventName] = useState("")
    const [selectedSport, setselectedSport] = useState("")
    const [sportNames, setsportNames] = useState([])
    const [timeslots, settimeslots] = useState([])

    useEffect(() => {
        getAndStore("sports/names", setsportNames)
    }, [])

    const addSlot = (name, helper, startTime, endTime, nonce) => {
        const slots = [...timeslots]
        slots.push({ "name": name, "start": startTime, "end": endTime, "helper": helper, "nonce": nonce })
        settimeslots(slots)
    }

    const addEvent = () => {
        if (date !== null && eventName !== "" && selectedSport !== "" && timeslots.length > 0) {
            doPostRequest("event/add", { "name": eventName, "date": date, "timeslots": timeslots })
            setdate(null)
            seteventName("")
            setselectedSport("")
            settimeslots([])
        }
    }

    return (
        <div>
            <Typography variant="h5">Event erstellen</Typography>
            <Spacer vertical={20} />
            <TextField className="eventsInput" type="text" variant="outlined" label="Event Name" value={eventName} onChange={(value) => seteventName(value.target.value)} error={eventName === ""} />
            <Spacer vertical={20} />
            <FormControl fullWidth>
                <InputLabel error={selectedSport === ""}>Sparte</InputLabel>
                <Select
                    className="eventsInput"
                    value={selectedSport}
                    label="Sparte"
                    onChange={(value) => setselectedSport(value.target.value)}
                    error={selectedSport === ""}
                >
                    {sportNames.map((sport) => <MenuItem key={sport.id} value={sport.id}>{sport.name}</MenuItem>)}
                </Select>
            </FormControl>
            <Spacer vertical={20} />

            <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale} >
                <DatePicker
                    className="eventsInput"
                    label="Event Datum"
                    value={date}
                    onChange={(newValue) => {
                        setdate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} className="eventsInput" error={date===null}/>}
                />
            </LocalizationProvider>
            <Spacer vertical={20} />
            <Typography variant="subtitle2">Schicht Erstellen</Typography>
            <Spacer vertical={10} />
            <EventSlotCreation createNewSlot={addSlot} />
            <Typography variant="subtitle2">Schichten</Typography>

            {timeslots.map((value) => {
                return <div>
                    <Spacer vertical={10} />
                    <EventTimeSlot
                        key={value.nonce}
                        slotName={value.name}
                        start={value.start + " Uhr"}
                        end={value.end + " Uhr"}
                        currentHelper={0}
                        maxHelper={value.helper}
                        onDelete={() => { settimeslots(timeslots.filter((innerValue) => value.nonce !== innerValue.nonce)) }} />
                </div>
            })}

            <Spacer vertical={20} />

            <Button variant="contained" className="accept" onClick={() => addEvent()}>
                Event erstellen
            </Button>
        </div>
    )
}

export default CreateEvent