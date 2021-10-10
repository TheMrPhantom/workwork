import React, { useEffect, useState } from 'react'
import Request from './Request'
import Member from './Member'
import { Typography } from '@material-ui/core'
import Spacer from '../Common/Spacer'
import { getAndStore } from '../Common/StaticFunctions'
const Sports = (props) => {
    //console.log(props)
    //props.match.params.id -> To get the sports id
    const [requests, setrequests] = useState([])
    const [members, setmembers] = useState([])

    useEffect(() => {
        getAndStore("work/request/" + props.match.params.id, setrequests)
        getAndStore("sports/" + props.match.params.id + "/members", setmembers)
    }, [props.match.params.id])
    return (
        <div>
            {requests.length>0?<Typography variant="h5">Anfragen</Typography>:""}
            {requests.length>0?<Spacer vertical={10} />:""}
            {requests.map((value) => {
                return <div><Request name={value.firstname + " " + value.lastname} work={value.description} amount={value.duration} />
                </div>
            })}
            {requests.length>0?<Spacer vertical={20} />:""}

            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10} />
            {members.map((value)=>{
                return <Member name={value.firstname+" "+value.lastname} currentWork={value.currentWork} maxWork={value.maxWork} isTrainer={value.isTrainer}/>
            })}
        </div>
    )
}

export default Sports
