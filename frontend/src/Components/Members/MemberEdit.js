import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Spacer from '../Common/Spacer'
import Request from '../Request/Request'
import ActivateSports from '../Settings/ActivateSports'
import Card from '../Settings/Card'
import MemberHistory from './MemberHistory'
import { doPostRequest, getAndStore } from '../Common/StaticFunctions'
import { useHistory } from 'react-router'

import "./MemberEntry.css"
import EditWorkHourOfUser from './EditWorkHourOfUser'
import ConfirmDialog from '../Common/ConfirmDialog'

const MemberEdit = (props) => {
    const [participant, setparticipant] = useState([])
    const [trainer, settrainer] = useState([])
    const [member, setmember] = useState(null)
    const [refresh, setrefresh] = useState(false)
    const [isExecutive, setisExecutive] = useState(false)
    const [isTrainer, setisTrainer] = useState(false)
    const history = useHistory();
    const [openConfirm, setopenConfirm] = useState(false);

    useEffect(() => {
        getAndStore("user/" + props.match.params.id + "/participantIn", setparticipant)
        getAndStore("user/" + props.match.params.id + "/trainerIn", settrainer)
        getAndStore("user/" + props.match.params.id, setmember)
        getAndStore("user/" + props.match.params.id + "/isExecutive", setisExecutive)
        getAndStore("user/" + props.match.params.id + "/isTrainer", setisTrainer)
    }, [props.match.params.id, refresh])

    const toggleReload = async () => {
        setrefresh(!refresh)
    }

    const deleteMember = async () => {
        const resp = await doPostRequest("member/delete/" + props.match.params.id)
        if (resp.code === 200) {
            history.push("/members")
        }
    }

    const executiveButtonText = () => {
        if (isExecutive) {
            return "Vorstandrolle entfernen"
        } else {
            return "Zum Vorstand machen"
        }
    }

    const makeExecutive = async () => {
        await doPostRequest("user/" + props.match.params.id + "/setExecutive", { "isExecutive": !isExecutive })
        toggleReload()
    }

    return (
        <div>
            {!isTrainer && !isExecutive ? <div>
                <Request memberID={props.match.params.id} refresh={refresh} />
                <Spacer vertical={50} />
            </div> : ""}
            <Typography variant="h5">Informationen</Typography>
            <Spacer vertical={20} />
            {member ? <Card firstname={member.firstname} lastname={member.lastname} mail={member.mail} memberID={props.match.params.id} /> : ""}
            <Spacer vertical={20} />
            <Typography variant="h6">Arbeitsstunden in Minuten</Typography>
            <EditWorkHourOfUser memberID={props.match.params.id} />
            <ActivateSports memberID={props.match.params.id} sportListMember={participant} sportListTrainer={trainer} setsports={setparticipant} refresh={toggleReload} />
            <Spacer vertical={50} />
            <Typography variant="h5">Arbeitsstunden</Typography>
            <MemberHistory memberID={props.match.params.id} />
            <Spacer vertical={20} />
            <div className="spacedOutFlexMemberEdit">
                <Button className="deleteMemberButton" onClick={() => setopenConfirm(true)}>Mitglied Löschen</Button>
                <ConfirmDialog title="Mitglied Löschen?" open={openConfirm} setOpen={setopenConfirm} onConfirm={() => deleteMember()} />
                <Button variant="outlined" onClick={() => makeExecutive()}>{executiveButtonText()}</Button>
            </div>
        </div>
    )
}

export default MemberEdit
