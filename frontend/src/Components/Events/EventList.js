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
    const history = useHistory();

    useEffect(() => {
        getAndStore("event", setevents)
        getAndStore("sports/names", setsportNames)
    }, [])

    return (
        <div>
            <div className="upcomingEventsHeadline">
                <Typography variant="h5">Anstehende Events</Typography>
                <Spacer horizontal={20} />
                <Button variant="outlined" onClick={() => history.push("events/create")}>Event Erstellen</Button>
            </div>
            <Spacer vertical={20} />
            <div className="upcomingEventsFlex">
                {events.map((value) => <EventListEntry
                    key={value.eventID}
                    eventID={value.eventID}
                    name={value.name}
                    sportName={sportNames.length > value.sportID ? sportNames[value.sportID]["name"] : "Lade ..."}
                    date={value.date}
                    timeslots={value.timeslots} />)}
            </div>
        </div>
    )
}

export default EventList
