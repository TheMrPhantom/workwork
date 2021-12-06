import { Paper, Typography, TextField } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import deLocale from 'date-fns/locale/de';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import "./OverviewBox.css"

const UpcomingEventsList = ({ events }) => {

    const fullscreenCard = () => {
        if (window.innerWidth > 650) {
            return "fullscreenCard"
        } else {
            return ""
        }
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
                {events.map((value) => (<tr>
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
