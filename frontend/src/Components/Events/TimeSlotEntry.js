import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import "./Events.css"

const TimeSlotEntry = ({ name, helper, start, end, id, memberState }) => {
    const [isParticipant, setisParticipant] = useState(false)
    const [reload, setreload] = useState(false)

    useEffect(() => {
        if (memberState < 2) {
            const memberID = Cookies.get("memberID")
            getAndStore("event/timeslot/" + id + "/participant/" + memberID, setisParticipant)
        }
    }, [id, reload, memberState])

    const GreenSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: "var(--primaryColor)",
            '&:hover': {
                backgroundColor: alpha("#000000", theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: "var(--primaryColor)",
        },
    }));

    const changeParticipation = async (value) => {
        const memberID = Cookies.get("memberID")
        const resp = await doPostRequest("event/timeslot/" + id + "/participant/" + memberID, value)
        if (resp.code === 200) {
            setreload(!reload)
        }
    }

    return (
        <div className="eventSlotList">
            <div className="eventSlotListLeft">
                <ArrowRightIcon />
                <div>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography variant="body1">{name}</Typography>
                </div>
            </div>
            <Spacer horizontal={30} />
            <div className="eventSlotListRight">
                <div className="eventNonSwitchCenter">
                    <Typography variant="subtitle2">Helfer</Typography>
                    <Typography variant="body1">{helper}</Typography>
                </div>
                <Spacer horizontal={30} />
                <div className="eventNonSwitchCenter">
                    <Typography variant="subtitle2">Beginn</Typography>
                    <Typography variant="body1">{start + " Uhr"}</Typography>
                </div>
                <Spacer horizontal={15} />
                <div className="eventNonSwitchCenter">
                    <Typography variant="subtitle2">Ende</Typography>
                    <Typography variant="body1">{end + " Uhr"}</Typography>
                </div>
                {memberState < 2 ? <Spacer horizontal={20} /> : ""}
                {memberState < 2 ?
                    <div className="eventCenter">
                        <Typography variant="subtitle2">Teilnehmen</Typography>
                        <GreenSwitch checked={isParticipant} onClick={(value) => changeParticipation(value.target.checked)} />
                    </div> : ""}
            </div>
        </div>
    )
}

export default TimeSlotEntry
