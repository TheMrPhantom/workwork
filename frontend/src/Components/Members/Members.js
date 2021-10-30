import { TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import MemberEntry from './MemberEntry'
import { getAndStore } from '../Common/StaticFunctions'
import AddMember from './AddMember'
import "./MemberEntry.css"
const Members = () => {
    const [members, setmembers] = useState([])
    const [filteredState, setfilteredMembers] = useState([])
    const [displayedMembers, setdisplayedMembers] = useState([])
    const [refresh, setrefresh] = useState(false)

    useEffect(() => {
        getAndStore("members", setmembers)
        getAndStore("members", setfilteredMembers)

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

    return (
        <div>
            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10} />
            <div className="horizontalMemberFloat">
                <TextField className="reasonBox" label="Suche" type="input" onChange={(value) => filterMembers(value.target.value)} />
                <AddMember buttonText="Hinzufügen" headlineText="Mitglied hinzufügen" confirmText="Hinzufügen" refresh={refreshComponent} />
            </div>
            <Spacer vertical={20} />
            {displayedMembers.map((value) => {
                return <div key={value.id}><MemberEntry name={value.firstname + " " + value.lastname} sportNames={value.sportNames} currentWork={value.currentWork} maxWork={value.maxWork} hasWorkHours={!(value.isTrainer || value.isExecutive)} id={value.id} /> <Spacer vertical={2} /></div>
            })}
        </div>
    )
}

export default Members
