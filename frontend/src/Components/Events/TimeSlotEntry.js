import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import "./Events.css"

const TimeSlotEntry = ({ name, helper, start, end, id, memberState }) => {
    const [isParticipant, setisParticipant] = useState(false)
    const [reload, setreload] = useState(false)
    const [participants, setparticipants] = useState([])
    const [participantAmount, setparticipantAmount] = useState(0)

    useEffect(() => {
        if (memberState < 2) {
            const memberID = Cookies.get("memberID")
            getAndStore("event/timeslot/" + id + "/participant/" + memberID, setisParticipant)
            getAndStore("event/timeslot/" + id + "/participants/amount",setparticipantAmount)
        } else {
            getAndStore("event/timeslot/" + id + "/participants", setparticipants)
        }
    }, [id, reload, memberState])

    const GreenSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: "var(--primaryColor)",
            '&:hover': {
                backgroundColor: alpha("#000000", theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
            color: "var(--secondaryColor)",
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

    const memberView = () => {
        return (<div className="eventSlotList">
            <div className="eventSlotListLeft">
                <div>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography variant="body1">{name}</Typography>
                </div>
            </div>
            <Spacer horizontal={30} />
            <div className="eventSlotListRight">
                <div className="eventNonSwitchCenter">
                    <Typography variant="subtitle2">Helfer</Typography>
                    <Typography variant="body1">{participantAmount}/{helper}</Typography>
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
                <Spacer horizontal={20} />

                <div className="eventCenter">
                    <Typography variant="subtitle2">Teilnehmen</Typography>
                    <GreenSwitch disabled={participantAmount>=helper&&!isParticipant} checked={isParticipant} onClick={(value) => changeParticipation(value.target.checked)} />
                </div>
            </div>
        </div>)
    }
    const trainerView = () => {
        return (
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}

            >
                <TreeItem nodeId="1" label={<div className="eventSlotList">
                    <div className="eventSlotListLeft">
                        <div>
                            <Typography variant="subtitle2">Name</Typography>
                            <Typography variant="body1">{name}</Typography>
                        </div>
                    </div>
                    <Spacer horizontal={30} />
                    <div className="eventSlotListRight">
                        <div className="eventNonSwitchCenter">
                            <Typography variant="subtitle2">Helfer</Typography>
                            <Typography variant="body1">{participants.length}/{helper}</Typography>
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
                    </div>
                </div>}>
                    {participants.map((value) => {
                        return (
                            <div>
                                <Spacer vertical={5} />
                                <TreeItem nodeId="2" label={value.firstname + " " + value.lastname} />
                            </div>
                        )
                    })}

                </TreeItem>
            </TreeView>)
    }

    if (memberState > 1) {
        return trainerView()
    } else {
        return memberView()
    }
}




export default TimeSlotEntry
