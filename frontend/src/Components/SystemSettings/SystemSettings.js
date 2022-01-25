import { Paper, Typography } from '@mui/material';
import React from 'react';
import "../Common/Common.css"
import Spacer from '../Common/Spacer';
import HalfYearSetter from './HalfYearSetter';
import SharedWorkTimeSetter from './SharedWorkTimeSetter';

const SystemSettings = () => {

    return <div className='flexContainer'>
        <Paper className='paperContainer'>
            <Typography variant='h5'>Allgemeine Arbeitsstunden</Typography>
            <Typography variant='caption'>Die Stundenzahl die jeder Leisten muss</Typography>
            <Spacer vertical={20} />
            <SharedWorkTimeSetter />
        </Paper>
        <Paper className='paperContainer'>
            <Typography variant='h5'>Jahresumbruch</Typography>
            <Typography variant='caption'>Datum zu dem nur noch die Hälfte geleistet werden muss</Typography>
            <Spacer vertical={20} />
            <HalfYearSetter />
        </Paper>
    </div>;
};

export default SystemSettings;
