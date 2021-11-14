import { Button, Typography } from '@material-ui/core'
import React, { useState } from 'react'
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

const CreateEvent = () => {
    const [date, setdate] = useState("")
    const [eventName, seteventName] = useState("")
    const [selectedSport, setselectedSport] = useState("")


    return (
        <div>
            <Typography variant="h5">Event erstellen</Typography>
            <Spacer vertical={20} />
            <TextField className="eventsInput" type="text" variant="outlined" label="Event Name" onChange={(value) => seteventName(value.target.value)} error={eventName === ""} />
            <Spacer vertical={20} />
            <FormControl fullWidth>
                <InputLabel>Verantwortlich</InputLabel>
                <Select
                    className="eventsInput"
                    value={selectedSport}
                    label="Verantwortlich"
                    onChange={(value) => setselectedSport(value.target.value)}
                    error={selectedSport === ""}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
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
                    renderInput={(params) => <TextField {...params} className="eventsInput" />}
                />
            </LocalizationProvider>
            <Spacer vertical={20} />
            <Typography variant="subtitle2">Zeitslot Erstellen</Typography>
            <Spacer vertical={10} />
            <EventSlotCreation />
            <Typography variant="subtitle2">Zeitslots</Typography>
            <Spacer vertical={10} />
            <EventTimeSlot slotName="Zeitmesser" start="13:00 Uhr" end="14:00 Uhr" currentHelper={0} maxHelper={3} />
            <Spacer vertical={10} />
            <EventTimeSlot slotName="Zeitmesser" start="14:00 Uhr" end="15:00 Uhr" currentHelper={0} maxHelper={3} />
            <Spacer vertical={10} />
            <EventTimeSlot slotName="Zeitmesser" start="15:00 Uhr" end="16:00 Uhr" currentHelper={0} maxHelper={3} />
            <Spacer vertical={10} />
            <EventTimeSlot slotName="Kuchenausgabe" start="13:30 Uhr" end="14:00 Uhr" currentHelper={0} maxHelper={3} />
            <Spacer vertical={10} />
            <EventTimeSlot slotName="Getränkeausgabe" start="13:45 Uhr" end="14:45 Uhr" currentHelper={0} maxHelper={3} />
            
            <Spacer vertical={20} />         

            <Button variant="contained" className="accept">
                Event erstellen
            </Button>
        </div>
    )
}

export default CreateEvent