import { Button, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import deLocale from 'date-fns/locale/de';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

import "./Events.css"
import { doPostRequest } from '../Common/StaticFunctions';
import TimeSlotEntry from './TimeSlotEntry';
import ConfirmButton from '../Common/ConfirmButton';

const EventListEntry = ({ eventID, name, sportName, date, timeslots, memberState, reloadEvents }) => {

    const [openDeleteDialog, setopenDeleteDialog] = useState(false);

    const deleteEvent = async (eventID) => {
        await doPostRequest("event/delete", eventID)
        reloadEvents()
    }

    return (<div>
        <Paper className="upcomingEventsBox">
            <div className="eventNameTimeslot">
                <div className="eventListEntryMainInfoOutter">
                    <div className="eventListEntryMainInfo">
                        <div>
                            <Typography variant="subtitle2">Event Name</Typography>
                            <Typography variant="body1">{name}</Typography>
                        </div>
                        <Spacer horizontal={20} />
                        <div>
                            <Typography variant="subtitle2">Sparte</Typography>
                            <Typography variant="body1">{sportName}</Typography>
                        </div>
                        <Spacer horizontal={20} />
                        <div>
                            <Typography variant="subtitle2">Datum</Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
                                <DatePicker
                                    readOnly
                                    value={date}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <ConfirmButton title="Event löschen?" open={openDeleteDialog} setOpen={setopenDeleteDialog} onConfirm={() => deleteEvent(eventID)} />
                    {memberState > 1 ? <Spacer horizontal={20} /> : ""}
                    {memberState > 1 ?
                        <Button onClick={() => setopenDeleteDialog(true)}>
                            <IndeterminateCheckBoxIcon className="denyBackground" />
                        </Button> : ""}

                </div>
                <Spacer vertical={20} />
                <Typography variant="subtitle1">Schichten</Typography>
                <div style={{ width: "100%" }}>
                    {timeslots.map((value) => {
                        return (<TimeSlotEntry
                            key={value.timeslotID}
                            id={value.timeslotID}
                            name={value.name}
                            helper={value.helper}
                            start={value.start}
                            end={value.end}
                            memberState={memberState} />)
                    })}
                </div>
            </div>
        </Paper>
        <Spacer vertical={10} />
    </div>
    )
}

export default EventListEntry
