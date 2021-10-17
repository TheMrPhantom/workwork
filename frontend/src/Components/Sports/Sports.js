import React, { useEffect, useState } from 'react'
import Request from './Request'
import Member from './Member'
import { Typography } from '@material-ui/core'
import Spacer from '../Common/Spacer'
import { getAndStore } from '../Common/StaticFunctions'
const Sports = (props) => {
    //props.match.params.id -> To get the sports id
    const [requests, setrequests] = useState([])
    const [members, setmembers] = useState([])
    const [refresh, setrefresh] = useState(false)

    useEffect(() => {
        getAndStore("work/request/" + props.match.params.id, setrequests)
        getAndStore("sports/" + props.match.params.id + "/members", setmembers)
        setrefresh(false)
    }, [props.match.params.id, refresh])

    return (
        <div>
            {requests.length > 0 ? <Typography variant="h5">Anfragen</Typography> : ""}
            {requests.length > 0 ? <Spacer vertical={10} /> : ""}
            {requests.map((value) => {
                return <div key={value.id}><Request name={value.firstname + " " + value.lastname} work={value.description} amount={value.duration} id={value.id} refresh={setrefresh}/>
                </div>
            })}
            {requests.length > 0 ? <Spacer vertical={20} /> : ""}

            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10} />
            {members.map((value) => {
                return <Member name={value.firstname + " " + value.lastname} currentWork={value.currentWork} maxWork={value.maxWork} isTrainer={value.isTrainer||value.isExecutive} refresh={setrefresh}/>
            })}
        </div>
    )
}

export default Sports
