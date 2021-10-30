import { Button, LinearProgress, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from "react-router-dom";
import "./MemberEntry.css"

const MemberEntry = ({ name, currentWork, maxWork, hasWorkHours, id, sportNames }) => {

    const [progressEntries, setprogressEntries] = useState([])

    useEffect(() => {

        var progressEntryTemp = []
        if (hasWorkHours) {
            for (var i = 0; i < Math.min(currentWork.length, maxWork.length, name.length); i++) {
                progressEntryTemp.push({ name: sportNames[i], currentWork: currentWork[i].hours, maxWork: maxWork[i].hours })
            }
        }

        setprogressEntries(progressEntryTemp)
    }, [currentWork, maxWork, sportNames])

    const history = useHistory();
    const calcProgress = (cW, mW) => {
        return (cW / mW) * 100
    }

    return (
        <Paper elevation={2} className="outterBoxMember">
            <div className="innerFlexMember">
                <Typography variant="h6">{name}</Typography>
                {hasWorkHours ? <Spacer horizontal={20} /> : ""}
                {progressEntries.map((value) => <div style={{ minWidth: "100px", marginRight: "10px" }}>
                    <Typography variant="caption">{value.name}</Typography>
                    <Spacer horizontal={10} />
                    <LinearProgress variant="determinate" value={calcProgress(value.currentWork, value.maxWork)} style={{ width: "100%" }} />
                    <Spacer horizontal={20} />
                    <Typography>{value.currentWork}/{value.maxWork}</Typography>
                </div>)}
            </div>
            <div>
                <Button onClick={() => history.push('/members/edit/' + id)}>
                    <EditIcon />
                </Button>
            </div>
        </Paper>
    )
}

export default MemberEntry
