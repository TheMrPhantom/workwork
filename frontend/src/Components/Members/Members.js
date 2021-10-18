import { TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import MemberEntry from './MemberEntry'
import { getAndStore } from '../Common/StaticFunctions'
import AddMember from './AddMember'
import "./MemberEntry.css"
const Members = () => {
    const [members, setmembers] = useState([])
    const [displayedMembers, setdisplayedMembers] = useState([])

    useEffect(() => {
        getAndStore("members", setmembers)
        getAndStore("members", setdisplayedMembers)

    }, [])

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
        setdisplayedMembers(newList)
    };

    return (
        <div>
            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10} />
            <div className="horizontalMemberFloat">
            <TextField className="reasonBox" label="Suche" type="input" onChange={(value) => filterMembers(value.target.value)} />
            <AddMember buttonText="Hinzufügen" headlineText="Mitglied hinzufügen" confirmText="Hinzufügen"/>
            </div>
            <Spacer vertical={20} />
            {displayedMembers.map((value) => {
                return <div key={value.id}><MemberEntry name={value.firstname + " " + value.lastname} currentWork={value.currentWork} maxWork={value.maxWork} hasWorkHours={!(value.isTrainer||value.isExecutive)} id={value.id}/> <Spacer vertical={2} /></div>
            })}
        </div>
    )
}

export default Members
