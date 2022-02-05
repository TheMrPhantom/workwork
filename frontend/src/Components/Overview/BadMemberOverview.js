import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer';
import { getAndStore, getHoursFromMember } from '../Common/StaticFunctions';
import Waiting from '../Common/Waiting';
import Member from '../Sports/Member';

const BadMemberOverview = ({ sportID, sportName }) => {

    const [members, setmembers] = useState([])
    const [displayedMembers, setdisplayedMembers] = useState(null)
    const [refresh, setrefresh] = useState(false)
    const [sportPos, setsportPos] = useState(250)
    const [refs, setrefs] = useState(new Map())
    const [loaded, setloaded] = useState(false);

    useEffect(() => {
        getAndStore("sports/" + sportID + "/members", (members) => { setmembers(members); setloaded(true) })
    }, [sportID])

    useEffect(() => {
        if (!loaded) {
            return
        }
        setdisplayedMembers(members.filter((value) => {
            const hours = getHoursFromMember(value)

            return hours[0] < hours[1]
        }))
    }, [members, loaded])

    useEffect(() => {
        var minPos = 0
        if (refs === undefined) {
            return
        }
        refs.forEach((element) => {
            if (element.current === null) {
                return;
            }
            minPos = Math.max(minPos, element.current.offsetWidth + 30)
        })
        setsportPos(minPos)
    }, [refs, refresh, members])

    const setRefsCorrect = (id, ref) => {
        const temp = refs
        temp.set(id, ref)
        setrefs(temp)
    }

    if (displayedMembers === null && sportID !== 1) {
        return (<div style={{ width: "100%" }}>
            <Typography variant="h6">{sportName}</Typography>
            <Waiting />
            <Spacer vertical={10} />
        </div>)
    } else if (displayedMembers === null) {
        return ""
    }

    if (displayedMembers.length > 0) {
        return (
            <div style={{ width: "100%" }}>
                <Typography variant="h6">{sportName}</Typography>
                <Spacer vertical={10} />
                {displayedMembers.map((value) => {
                    return <Member
                        key={value.id}
                        id={value.id}
                        name={value.firstname + " " + value.lastname}
                        currentWork={value.currentWork}
                        maxWork={value.maxWork}
                        isTrainer={value.isTrainer || value.isExecutive}
                        refresh={setrefresh}
                        setRefs={setRefsCorrect}
                        sportsPosition={sportPos} />
                })}
                <Spacer vertical={20} />
            </div>
        )
    } else {
        return ""
    }
}

export default BadMemberOverview
