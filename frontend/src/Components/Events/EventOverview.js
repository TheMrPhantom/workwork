import React from 'react'
import CreateEvent from './CreateEvent'
import EventList from './EventList'

const EventOverview = () => {
    return (
        <div>
            <EventList />
            <CreateEvent />
        </div>
    )
}

export default EventOverview
