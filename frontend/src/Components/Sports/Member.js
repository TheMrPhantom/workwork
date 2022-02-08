import React, { useEffect, useRef, useState } from 'react'
import { Paper, Typography } from '@mui/material'
import { Button } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import LinearProgress from '@mui/material/LinearProgress';
import ClearIcon from '@mui/icons-material/Clear';
import Spacer from '../Common/Spacer';
import AddWork from './AddWork';

import "./Member.css";
import "./Request.css"


const Member = ({ name, currentWork, maxWork, isTrainer, id, setRefs, refresh, sportsPosition }) => {

    const [addIsOpen, setaddIsOpen] = useState(false)
    const [hours, sethours] = useState([])
    const calcProgress = (cw, mw) => {
        return (cw / mw) * 100
    }

    const buttonClick = () => {
        setaddIsOpen(!addIsOpen)
    }

    useEffect(() => {
        const newArray = []
        if (!isTrainer) {
            for (var i = 0; i < Math.min(currentWork.length, maxWork.length); i++) {
                newArray.push({ name: currentWork[i].name, currentWork: currentWork[i].hours, maxWork: maxWork[i].hours })
            }
        }
        sethours(newArray)
    }, [currentWork, maxWork, isTrainer])

    useEffect(() => {
        refresh(true)
    }, [refresh])

    var ref = useRef(null)
    setRefs(id, ref)

    const displayAddDialog = () => {
        if (addIsOpen) {
            return (<div>
                <Spacer vertical={15} />
                <AddWork memberID={id} />
            </div>
            )
        }
    }

    const displayButton = () => {
        if (!isTrainer) {
            if (!addIsOpen) {
                return (
                    <Button className="accept" onClick={() => buttonClick()}>
                        <AddBoxIcon />
                    </Button>
                )
            } else {
                return (
                    <Button className="close" onClick={() => buttonClick()}>
                        <ClearIcon />
                    </Button>
                )
            }
        }
    }

    return (
        <Paper elevation={2} className="requestBox" style={{ position: "relative" }}>
            <div className="outterFlex">
                <div className="innerFlex fullWidth">
                    <Typography variant="h6" className="border" ref={ref}>{name}</Typography>
                    <Spacer horizontal={20} />
                    <div className={window.innerWidth > 1100 ? "sportAlignDesktop" : ""} style={{ left: sportsPosition }}>
                        {hours.map((value) => <div style={{ minWidth: "100px", marginRight: "10px" }}>
                            <Typography variant="caption">{value.name}</Typography>
                            <Spacer horizontal={10} />
                            <LinearProgress variant="determinate" value={calcProgress(value.currentWork, value.maxWork)} style={{ width: "100%" }} />
                            <Spacer horizontal={20} />
                            <Typography>{value.currentWork}/{value.maxWork}</Typography>
                        </div>)}
                    </div>
                </div>
                <Spacer horizontal={5} />
                {displayButton()}
            </div>
            {displayAddDialog()}
        </Paper>
    )
}

export default Member
