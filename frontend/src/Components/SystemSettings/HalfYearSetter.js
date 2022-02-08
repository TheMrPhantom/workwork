import React, { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import deLocale from 'date-fns/locale/de';
import { TextField } from '@mui/material';
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';

const HalfYearSetter = () => {
    const [date, setdate] = useState(null)

    useEffect(() => {
        getAndStore("settings/halfyear", setdate)
    }, [])

    const sendDate = async (newValue) => {
        setdate(newValue);
        doPostRequest("settings/halfyear", { newValue })
    }


    return <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
        <DatePicker
            label="Event Datum"
            views={['month', 'day']}
            value={date}
            variant="outlined"
            onChange={(newValue) => {
                sendDate(newValue)
            }}
            renderInput={(params) => <TextField {...params} className="eventsInput" error={date === null} />}
        />
    </LocalizationProvider>;
};

export default HalfYearSetter;
