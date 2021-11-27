import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import { getAndStore } from '../Common/StaticFunctions'
import EventListEntry from './EventListEntry'
import { useHistory } from "react-router-dom";
import "./Events.css"

const EventList = () => {
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

    const reloadEvents=()=>{
        setreloadEventState(!reloadEventState)
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
                {events.map((value) => <EventListEntry
                    key={value.eventID}
                    eventID={value.eventID}
                    name={value.name}
                    sportName={sportNames.length > value.sportID ? sportNames[value.sportID-1]["name"] : "Lade ..."}
                    date={value.date}
                    timeslots={value.timeslots}
                    memberState={memberState}
                    reloadEvents={reloadEvents}
                />)}
            </div>


        </div>
    )
}

export default EventList
