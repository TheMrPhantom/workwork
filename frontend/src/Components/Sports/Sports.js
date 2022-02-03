import React, { useEffect, useState } from 'react'
import Request from './Request'
import Member from './Member'
import { Typography } from '@material-ui/core'
import Spacer from '../Common/Spacer'
import { getAndStore } from '../Common/StaticFunctions'
import SendMail from './SendMail'

import "./Sport.css"
import HSFAlert from '../Common/HSFAlert'

const Sports = (props) => {
    //props.match.params.id -> To get the sports id
    const [requests, setrequests] = useState([])
    const [members, setmembers] = useState([])
    const [refresh, setrefresh] = useState(false)
    const [sportPos, setsportPos] = useState(250)
    const [refs, setrefs] = useState(new Map())
    const [mailsuccessDialog, setmailsuccessDialog] = useState(false)

    useEffect(() => {
        getAndStore("work/request/" + props.match.params.id, setrequests)
        getAndStore("sports/" + props.match.params.id + "/members", setmembers)
        setrefresh(false)
    }, [props.match.params.id, refresh])

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

    return (
        <div>
            {parseInt(props.match.params.id) === 1 ? <div style={{ display: 'flex' }}>
                <Typography variant="h5">Mail an alle Mitglieder</Typography>
                <SendMail headlineText="Rundmail Senden" confirmText="Senden" successOpen={setmailsuccessDialog} /></div> : ""}
            {parseInt(props.match.params.id) === 1 ? <Spacer vertical={30} /> : ""}
            {requests.length > 0 ? <Typography variant="h5">Anfragen</Typography> : ""}
            {requests.length > 0 ? <Spacer vertical={10} /> : ""}
            {requests.map((value) => {
                return <div key={value.id}><Request name={value.firstname + " " + value.lastname} work={value.description} amount={value.duration} id={value.id} refresh={setrefresh} />
                </div>
            })}
            {requests.length > 0 ? <Spacer vertical={20} /> : ""}
            {requests.length === 0 && parseInt(props.match.params.id) === 1 ? <Typography variant="h5">Aktuell keine Anfragen</Typography> : ""}
            {parseInt(props.match.params.id) !== 1 ? <div className="sportHeadline">
                <Typography variant="h5">Mitglieder</Typography>
                <Spacer horizontal={10} />
                <SendMail headlineText="Rundmail Senden" confirmText="Senden" successOpen={setmailsuccessDialog} sportID={props.match.params.id} />
                <HSFAlert type="success" message="Nachricht erfolgreich gesendet" open={mailsuccessDialog} setOpen={setmailsuccessDialog} />
            </div> : ""}
            <Spacer vertical={10} />
            {members.sort((c1, c2) => c1.firstname.localeCompare(c2.firstname)).map((value) => {
                return (<Member key={value.id}
                    id={value.id}
                    name={value.firstname + " " + value.lastname}
                    currentWork={value.currentWork}
                    maxWork={value.maxWork}
                    isTrainer={value.isTrainer || value.isExecutive}
                    refresh={setrefresh}
                    setRefs={setRefsCorrect}
                    sportsPosition={sportPos} />)
            })}
        </div>
    )
}

export default Sports
