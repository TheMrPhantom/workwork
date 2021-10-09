import React from 'react'
import { Paper } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning';

import "./OverviewBox.css"

const OverviewBox = ({ currentHours, maxHours }) => {

    const checkColorAndIcon = (currentHours, maxHours) => {
        if (currentHours < maxHours) {
            return <div className="flexHorizontalSpaced warningColor">
                <Typography variant="h5">{currentHours}/{maxHours}</Typography>
                <WarningIcon></WarningIcon>
            </div>
        } else {
            return <div className="flexHorizontalSpaced successColor">
                <Typography variant="h5">{currentHours}/{maxHours}</Typography>
            </div>
        }
    };

    return (
        <div>
        <Paper className="overviewContainer" elevation={2}>
            <Typography variant="h6">Arbeitsstunden abgeleistet:</Typography>

            {checkColorAndIcon(5,12)}
        </Paper>

        <Paper className="overviewContainer" elevation={2}>
            <Typography variant="h6">Arbeitsstunden abgeleistet:</Typography>

            {checkColorAndIcon(12,12)}
        </Paper>
        </div>
    )
}

export default OverviewBox
