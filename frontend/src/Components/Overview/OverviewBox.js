import React, { useState, useEffect } from 'react'
import { Paper } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning';
import Cookies from 'js-cookie';
import { getAndStore } from "../Common/StaticFunctions"

import "./OverviewBox.css"
import Spacer from '../Common/Spacer';

const OverviewBox = () => {
    const [currentHours, setcurrentHours] = useState([])
    const [maxHours, setmaxHours] = useState([])

    useEffect(() => {
        const memberID = Cookies.get("memberID")

        getAndStore("user/" + memberID + "/currentHours", setcurrentHours)
        getAndStore("user/" + memberID + "/neededHours", setmaxHours)
    }, []);

    const checkColorAndIcon = (currentHours, maxHours) => {
        if (currentHours < maxHours) {
            return <div className="flexHorizontalSpaced warningColor">
                <Typography variant="h5">{currentHours}/{maxHours}h</Typography>
                <WarningIcon></WarningIcon>
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
                {maxHours.map((value) => {
                    return (<div>
                        <Typography variant="h6">{value.name}:</Typography>
                        {checkColorAndIcon("??", value.hours)}
                        <Spacer vertical={10} />
                    </div>
                    )
                })}

                <Typography variant="h6">Wartet auf Genehmigung</Typography>
                <Typography variant="h5">3h</Typography>
                <Spacer vertical={10} />
                <Typography variant="h6">Nächster Arbeitsdienst</Typography>
                <Typography variant="h5" className="imageTextWidth">Donnerstag 25.November, um 15 Uhr auf dem Hundeplatz</Typography>
            </Paper>
        </div>
    )
}

export default OverviewBox
