import { Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';
import Cookies from 'js-cookie';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import "./Events.css"
import HSFAlert from '../Common/HSFAlert';

const TimeSlotEntry = ({ name, helper, start, end, id, memberState }) => {
    const [isParticipant, setisParticipant] = useState(false)
    const [reload, setreload] = useState(false)
    const [participants, setparticipants] = useState([])
    const [participantAmount, setparticipantAmount] = useState(0)
    const [messageOpen, setmessageOpen] = useState(false)

    useEffect(() => {
        if (memberState < 2) {
            const memberID = Cookies.get("memberID")
            getAndStore("event/timeslot/" + id + "/participant/" + memberID, setisParticipant)
            getAndStore("event/timeslot/" + id + "/participants/amount", setparticipantAmount)
        } else {
            getAndStore("event/timeslot/" + id + "/participants", setparticipants)
        }
    }, [id, reload, memberState])



    const changeParticipation = async (value) => {
        const memberID = Cookies.get("memberID")
        const resp = await doPostRequest("event/timeslot/" + id + "/participant/" + memberID, value)
        if (resp.code === 409) {
            setmessageOpen(true)
        }
        setreload(!reload)
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
                    <Switch disabled={participantAmount >= helper && !isParticipant} checked={isParticipant} onClick={(value) => changeParticipation(value.target.checked)} />
                </div>
            </div>
            <HSFAlert message="Schicht inzwischen voll" short="Bitte andere Schicht auswählen " open={messageOpen} setOpen={setmessageOpen} />
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
