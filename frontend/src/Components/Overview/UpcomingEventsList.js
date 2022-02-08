import { Paper, Typography, TextField } from '@mui/material'
import React from 'react'
import Spacer from '../Common/Spacer'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import deLocale from 'date-fns/locale/de';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import "./OverviewBox.css"
import { useHistory } from 'react-router-dom';

const UpcomingEventsList = ({ events }) => {
    const history = useHistory();

    const fullscreenCard = () => {
        if (window.innerWidth > 650) {
            return "fullscreenCard"
        } else {
            return ""
        }
    }

    const onClickEvent = (id) => {
        history.push("events/" + id)
    }

    return (
        <Paper className={fullscreenCard() + " overviewEventsContainer"} elevation={2}>
            <Typography variant="h6">Anstehende Events</Typography>
            <Spacer vertical={10} />
            <table>
                <tr style={{ textAlign: "left" }}>
                    <th><Typography variant="caption" >Event Name</Typography></th>
                    <th style={{ paddingLeft: "50px" }}><Typography variant="caption" >Event Datum</Typography></th>
                </tr>
                {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map((value) => (<tr className='overviewEventEntry' onClick={() => onClickEvent(value.eventID)}>
                    <td>
                        <Typography variant="body1" key={value.eventID}>{value.name}</Typography>
                    </td>
                    <td style={{ paddingLeft: "50px" }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale} >
                            <DatePicker
                                readOnly
                                value={value.date}
                                renderInput={(params) => <TextField style={{ width: "120px" }} {...params} />}
                            />
                        </LocalizationProvider>
                    </td>
                </tr>))}
            </table>
        </Paper>
    )
}

export default UpcomingEventsList
