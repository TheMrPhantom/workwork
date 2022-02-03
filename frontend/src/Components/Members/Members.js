import { TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import MemberEntry from './MemberEntry'
import { getAndStore } from '../Common/StaticFunctions'
import AddMember from './AddMember'
import "./MemberEntry.css"
import HSFAlert from '../Common/HSFAlert'

const Members = () => {
    const [members, setmembers] = useState([])
    const [filteredState, setfilteredMembers] = useState([])
    const [displayedMembers, setdisplayedMembers] = useState([])
    const [refresh, setrefresh] = useState(false)
    const [sportPos, setsportPos] = useState(250)
    const [openSuccess, setopenSuccess] = useState(false)
    const [refs, setrefs] = useState(new Map())

    useEffect(() => {
        getAndStore("members", (newState) => { setmembers(newState.sort((c1, c2) => c1.firstname.localeCompare(c2.firstname))) })
        getAndStore("members", (newState) => { setfilteredMembers(newState.sort((c1, c2) => c1.firstname.localeCompare(c2.firstname))) })

    }, [refresh])

    useEffect(() => {
        const newArray = []
        filteredState.forEach((value) => {
            const sportNames = []
            const works = []
            value.currentWork.forEach((value) => { sportNames.push(value.name) })
            for (var i = 0; i < Math.min(value.currentWork.length, value.maxWork.length); i++) {
                works.push([value.currentWork[i].hours, value.maxWork[i].hours])
            }
            newArray.push({ ...value, sportNames: sportNames, work: works })
        })
        setdisplayedMembers(newArray)
    }, [filteredState])

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
    }, [refs, refresh, displayedMembers])

    const filterMembers = (text) => {
        const newList = members.filter((item) => {
            var firstname = item.firstname
            var lastname = item.lastname
            var email = item.email
            var searchText = text
            firstname = firstname.toLowerCase()
            lastname = lastname.toLowerCase()
            email = email.toLowerCase()
            searchText = searchText.toLowerCase()

            return firstname.includes(searchText) || lastname.includes(searchText) || email.includes(searchText)
        })
        setfilteredMembers(newList)
    };

    const refreshComponent = () => {
        setrefresh(!refresh)
    }

    const setRefsCorrect = (id, ref) => {
        const temp = refs
        temp.set(id, ref)
        setrefs(temp)
    }

    return (
        <div>
            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10} />
            <div className="horizontalMemberFloat">
                <TextField className="reasonBox" label="Suche" type="input" onChange={(value) => filterMembers(value.target.value)} />
                <AddMember buttonText="Hinzufügen" headlineText="Mitglied hinzufügen" confirmText="Hinzufügen" refresh={refreshComponent} setRegistrationOpen={setopenSuccess} />
                <HSFAlert
                    type="success"
                    message="Erfolgreich Registriert, das initiale Passwort wird dem Mitglied zugeschickt"
                    short="Dies kann ein paar Minuten dauern"
                    open={openSuccess}
                    setOpen={setopenSuccess}
                    time={15000} />
            </div>
            <Spacer vertical={20} />
            {displayedMembers.map((value) => {
                return (<div key={value.id}>
                    <MemberEntry
                        name={value.firstname + " " + value.lastname}
                        sportNames={value.sportNames}
                        currentWork={value.currentWork}
                        maxWork={value.maxWork}
                        hasWorkHours={!(value.isTrainer || value.isExecutive)}
                        id={value.id}
                        setRefs={setRefsCorrect}
                        sportsPosition={sportPos}
                        refresh={setrefresh} />
                    <Spacer vertical={2} />
                </div>)
            })}
        </div>
    )
}

export default Members
