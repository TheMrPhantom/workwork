import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer';
import { getAndStore, getHoursFromMember } from '../Common/StaticFunctions';
import Member from '../Sports/Member';

const BadMemberOverview = ({ sportID, sportName }) => {

    const [members, setmembers] = useState([])
    const [displayedMembers, setdisplayedMembers] = useState([])
    const [refresh, setrefresh] = useState(false)

    useEffect(() => {
        getAndStore("sports/" + sportID + "/members", setmembers)
    }, [refresh, sportID])

    useEffect(() => {
        setdisplayedMembers(members.filter((value) => {
            const hours = getHoursFromMember(value)

            return hours[0] < hours[1]
        }))
    }, [members])

    

    if (displayedMembers.length > 0) {
        return (
            <div style={{ width: "100%" }}>
                <Typography variant="h6">{sportName}</Typography>
                <Spacer vertical={10} />
                {displayedMembers.map((value) => {
                    return <Member key={value.id} id={value.id} name={value.firstname + " " + value.lastname} currentWork={value.currentWork} maxWork={value.maxWork} isTrainer={value.isTrainer || value.isExecutive} refresh={setrefresh} />
                })}
                <Spacer vertical={20} />
            </div>
        )
    } else {
        return ""
    }
}

export default BadMemberOverview
