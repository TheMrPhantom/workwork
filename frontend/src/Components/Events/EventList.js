import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import { getAndStore } from '../Common/StaticFunctions'
import EventListEntry from './EventListEntry'
import { useHistory } from "react-router-dom";
import "./Events.css"

const EventList = (props) => {
    const [events, setevents] = useState([])
    const [sportNames, setsportNames] = useState([])
    const [memberState, setmemberState] = useState(0)
    const [reloadEventState, setreloadEventState] = useState(false)
    const history = useHistory();

    useEffect(() => {
        getAndStore("event", setevents)
        getAndStore("sports/names", setsportNames)
        getAndStore("memberstate", setmemberState)
    }, [reloadEventState])

    const displayCreateButton = () => {
        if (memberState > 1) {
            return (
                <Button variant="outlined" onClick={() => history.push("events/create")}>Event Erstellen</Button>
            )
        }
    }

    const reloadEvents = () => {
        setreloadEventState(!reloadEventState)
    }


    if (props.match.params.id === "") {
        return ""
    }

    return (
        <div>
            <div className="upcomingEventsHeadline">
                <Typography variant="h5">Anstehende Events</Typography>
                <Spacer horizontal={20} />
                {displayCreateButton()}

            </div>
            <Spacer vertical={20} />
            <div className="upcomingEventsFlex">
                {events.map((value) => {
                    const sport = sportNames.filter((s) => s.id === value.sportID);
                    return (<EventListEntry
                        key={value.eventID}
                        eventID={value.eventID}
                        name={value.name}
                        sportName={sportNames.length + 1 > value.sportID ? sport[0].name : "Lade ..."}
                        date={value.date}
                        timeslots={value.timeslots}
                        memberState={memberState}
                        reloadEvents={reloadEvents}
                        highlighted={value.eventID === parseInt(props.match.params.id)}
                    />)
                })}
            </div>


        </div>
    )
}

export default EventList
