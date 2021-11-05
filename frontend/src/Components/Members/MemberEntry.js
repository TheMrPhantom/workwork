import { Button, LinearProgress, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import Spacer from '../Common/Spacer'
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from "react-router-dom";
import "./MemberEntry.css"

const MemberEntry = ({ name, currentWork, maxWork, hasWorkHours, id, sportNames, setRefs, refresh, sportsPosition }) => {

    const [progressEntries, setprogressEntries] = useState([])

    useEffect(() => {

        var progressEntryTemp = []
        if (hasWorkHours) {
            for (var i = 0; i < Math.min(currentWork.length, maxWork.length, name.length); i++) {
                progressEntryTemp.push({ name: sportNames[i], currentWork: currentWork[i].hours, maxWork: maxWork[i].hours })
            }
        }

        setprogressEntries(progressEntryTemp)
    }, [currentWork, maxWork, sportNames, hasWorkHours, name])

    useEffect(() => {
        refresh(true)
    }, [refresh])

    const history = useHistory();
    const calcProgress = (cW, mW) => {
        return (cW / mW) * 100
    }

    var ref = useRef(null)
    setRefs(id, ref)

    return (
        <Paper elevation={2} className="outterBoxMember" style={{ position: "relative" }}>
            <div className="innerFlexMember">
                <Typography variant="h6" ref={ref}>{name}</Typography>
                {hasWorkHours ? <Spacer horizontal={20} /> : ""}
                <div className={window.innerWidth > 1100 ? "sportAlignDesktop" : ""} style={{ left: sportsPosition }}>
                    {progressEntries.map((value) => <div className="sportProgress">
                        <Typography variant="caption">{value.name}</Typography>
                        <Spacer horizontal={10} />
                        <LinearProgress variant="determinate" value={calcProgress(value.currentWork, value.maxWork)} style={{ width: "100px" }} />
                        <Spacer horizontal={20} />
                        <Typography>{value.currentWork}/{value.maxWork}</Typography>
                    </div>)}
                </div>
            </div>
            <div>
                <Button onClick={() => history.push('/members/edit/' + id)}>
                    <EditIcon />
                </Button>
            </div>
        </Paper >
    )
}

export default MemberEntry
