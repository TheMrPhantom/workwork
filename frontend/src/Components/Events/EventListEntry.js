import { Button, Paper, TextField, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import deLocale from 'date-fns/locale/de';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import "./Events.css"
import { doPostRequest } from '../Common/StaticFunctions';

const EventListEntry = ({ eventID, name, sportName, date, timeslots }) => {

    const deleteEvent = async () => {
        doPostRequest("event/delete", eventID)
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
                    <Button onClick={() => deleteEvent()}>
                        <IndeterminateCheckBoxIcon className="denyBackground" />
                    </Button>

                </div>
                <Spacer vertical={20} />
                <Typography variant="subtitle1">Schichten</Typography>
                <div style={{ width: "100%" }}>
                    {timeslots.map((value) => {
                        return (<div className="eventSlotList">
                            <div className="eventSlotListLeft">
                                <ArrowRightIcon />
                                <div>
                                    <Typography variant="subtitle2">Name</Typography>
                                    <Typography variant="body1">{value.name}</Typography>
                                </div>
                            </div>
                            <div className="eventSlotListRight">
                                <div>
                                    <Typography variant="subtitle2">Helfer</Typography>
                                    <Typography variant="body1">{value.helper}</Typography>
                                </div>
                                <Spacer horizontal={30} />
                                <div>
                                    <Typography variant="subtitle2">Beginn</Typography>
                                    <Typography variant="body1">{value.start + " Uhr"}</Typography>
                                </div>
                                <Spacer horizontal={15} />
                                <div>
                                    <Typography variant="subtitle2">Ende</Typography>
                                    <Typography variant="body1">{value.end + " Uhr"}</Typography>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
            </div>
        </Paper>
        <Spacer vertical={10} />
    </div>
    )
}

export default EventListEntry
