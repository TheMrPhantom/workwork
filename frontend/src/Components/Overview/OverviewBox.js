import React, { useState, useEffect } from 'react'
import { Paper } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning';
import "./OverviewBox.css"
import { getAndStore } from "../Common/StaticFunctions"

const OverviewBox = () => {
    const [currentHours, setcurrentHours] = useState(0)
    const [maxHours, setmaxHours] = useState(0)

    useEffect(() => {
        getAndStore("user/3/currentHours",setcurrentHours)
        getAndStore("user/3/neededHours",setmaxHours)
    },[]);

    const checkColorAndIcon = (currentHours, maxHours) => {
        if (currentHours < maxHours) {
            return <div className="flexHorizontalSpaced warningColor">
                <Typography variant="h5">{currentHours}/{maxHours}</Typography>
                <WarningIcon></WarningIcon>
            </div>
        } else {
            return <div className="flexHorizontalSpaced successColor">
                <Typography variant="h5">{currentHours}/{currentHours}</Typography>
            </div>
        }
    };

    return (
        <div>
            <Paper className="overviewContainer" elevation={2}>
                <Typography variant="h6">Arbeitsstunden abgeleistet:</Typography>

                {checkColorAndIcon(currentHours, maxHours)}
            </Paper>
        </div>
    )
}

export default OverviewBox
