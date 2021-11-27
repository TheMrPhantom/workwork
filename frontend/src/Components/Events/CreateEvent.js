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
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';
import { useHistory } from "react-router-dom";
import HSFAlert from '../Common/HSFAlert'
import "./Events.css"

const CreateEvent = () => {
    const [date, setdate] = useState(null)
    const [eventName, seteventName] = useState("")
    const [selectedSport, setselectedSport] = useState("")
    const [sportNames, setsportNames] = useState([])
    const [timeslots, settimeslots] = useState([])
    const history = useHistory();
    const [messageOpen, setmessageOpen] = useState(false)
    const [badDialogMessageOpen, setbadDialogMessageOpen] = useState(false)
    const [badDialogMessage, setbadDialogMessage] = useState("")

    useEffect(() => {
        getAndStore("sports/names", setsportNames)
    }, [])

    const addSlot = (name, helper, startTime, endTime, nonce) => {
        const slots = [...timeslots]
        slots.push({ "name": name, "start": startTime, "end": endTime, "helper": helper, "nonce": nonce })
        settimeslots(slots)
    }

    const addEvent = async () => {
        if (date !== null && eventName !== "" && selectedSport !== "" && timeslots.length > 0) {
            const resp = await doPostRequest("event/add", { "name": eventName, "sportID": selectedSport, "date": date, "timeslots": timeslots })
            if (resp.code === 409) {
                setmessageOpen(true)
                return
            }
            setdate(null)
            seteventName("")
            setselectedSport("")
            settimeslots([])
            history.push("/events")
        } else {
            if (eventName === "") {
                setbadDialogMessage("Keinen Eventnamen gesetzt")
            } else if (selectedSport === "") {
                setbadDialogMessage("Keine Sportart ausgewählt")
            } else if (date === null) {
                setbadDialogMessage("Kein Datum gesetzt")
            } else if (timeslots.length === 0) {
                setbadDialogMessage("Keine Zeitslots angelegt")
            }
            setbadDialogMessageOpen(true)
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
                    renderInput={(params) => <TextField {...params} className="eventsInput" error={date === null} />}
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

            {timeslots.length === 0 ? <div><Spacer vertical={10} /><Typography style={{ color: "var(--errorColor)" }}>Noch keine Schichten erstellt</Typography></div> : ""}

            <Spacer vertical={20} />

            <Button variant="contained" className="accept" onClick={() => addEvent()}>
                Event erstellen
            </Button>
            <HSFAlert message="Event existiert bereits" short="Bitte mit anderem Namen erneut versuchen" open={messageOpen} setOpen={setmessageOpen} />
            <HSFAlert message={badDialogMessage} short="Bitte Felder korrekt ausfüllen" open={badDialogMessageOpen} setOpen={setbadDialogMessageOpen} />
        </div>
    )
}

export default CreateEvent