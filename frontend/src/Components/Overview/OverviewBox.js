import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning';
import Cookies from 'js-cookie';
import { getAndStore } from "../Common/StaticFunctions"

import "./OverviewBox.css"
import Spacer from '../Common/Spacer';

const OverviewBox = () => {
    const [currentHours, setcurrentHours] = useState([])
    const [maxHours, setmaxHours] = useState([])

    const [hours, sethours] = useState([])

    useEffect(() => {
        const memberID = Cookies.get("memberID")

        getAndStore("user/" + memberID + "/currentHours", setcurrentHours)
        getAndStore("user/" + memberID + "/neededHours", setmaxHours)
    }, []);

    useEffect(() => {
        const newArray = []
        for (var i = 0; i < Math.min(currentHours.length, maxHours.length); i++) {
            newArray.push({ name: currentHours[i].name, currentHours: currentHours[i].hours, maxHours: maxHours[i].hours })
        }
        sethours(newArray)
    }, [currentHours, maxHours])

    const checkColorAndIcon = (currentHours, maxHours) => {
        if (currentHours < maxHours) {
            return <div className="flexHorizontalSpaced warningColor" style={{ position: "relative" }}>
                <Typography variant="h5">{currentHours}/{maxHours}h</Typography>
                <WarningIcon style={{ position: "absolute", right: "50%" }}></WarningIcon>
            </div>
        } else {
            return <div className="flexHorizontalSpaced successColor">
                <Typography variant="h5">{currentHours}/{maxHours}h</Typography>
            </div>
        }
    };

    const imageIfFullScreen = () => {
        if (window.innerWidth > 650) {
            return "backgroundCardImage"
        } else {
            return ""
        }
    }

    return (
        <div>
            <Paper className={imageIfFullScreen() + " overviewContainer"} elevation={2}>
                {hours.map((value) => {
                    return (<div>
                        <Typography variant="h6">{value.name}:</Typography>
                        {checkColorAndIcon(value.currentHours, value.maxHours)}
                        <Spacer vertical={10} />
                    </div>
                    )
                })}
            </Paper>
        </div>
    )
}

export default OverviewBox
