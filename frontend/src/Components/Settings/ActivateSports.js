import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React, { useState } from 'react'
import HSFAlert from '../Common/HSFAlert'
import { doPostRequest } from '../Common/StaticFunctions'
import ActivateSportsEntry from './ActivateSportsEntry'

const ActivateSports = ({ memberID, sportListMember, sportListTrainer, refresh }) => {

    const [alertOpen, setalertOpen] = useState(false)

    const changeTrainerOrParticipation = async (column, id, checked) => {
        var output = null
        //if (sportListMember === null) {
        //    return
        //}
        if (column === "Teilnehmer") {
            output = sportListMember.map((value) => {
                if (value.id === id) {
                    value.isParticipant = checked
                }
                return value
            })
            const resp = await doPostRequest("user/" + memberID + "/changeParticipation", output)
            if (resp.code === 200) {
                setalertOpen(true)
            }
        } else {
            output = sportListTrainer.map((value) => {
                if (value.id === id) {
                    value.isTrainer = checked
                }
                return value
            })
            const respT = await doPostRequest("user/" + memberID + "/changeTrainer", output)
            if (respT.code === 200) {
                setalertOpen(true)
            }
        }

        if (refresh !== null) {
            refresh(true)
        }
    }

    const buildList = () => {
        var output = []
        for (var i = 1; i < Math.min(sportListMember.length, sportListTrainer.length); i++) {
            output.push(<ActivateSportsEntry
                key={i}
                isParticipantMember={sportListMember[i].isParticipant}
                isParticipantTrainer={sportListTrainer[i].isTrainer}
                name={sportListMember[i].name}
                id={sportListMember[i].id}
                checkedChange={changeTrainerOrParticipation} />)
        }
        return output
    }
    return (
        <TableContainer className="tableContainer" component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Teilnehmer</TableCell>
                        {sportListTrainer !== undefined ?
                            <TableCell>Trainer</TableCell> : ""}
                        <TableCell>Sparte</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sportListTrainer === undefined ?
                        sportListMember.map((value) => {
                            if (value.id === 1) {
                                return ""
                            }
                            return <ActivateSportsEntry key={value.id} isParticipantMember={value.isParticipant} name={value.name} id={value.id} checkedChange={changeTrainerOrParticipation} />
                        }) :

                        buildList().map((value) => {
                            return value
                        })}

                </TableBody>
            </Table>
            <HSFAlert type="success" message="Gespeichert" open={alertOpen} setOpen={setalertOpen} />
        </TableContainer>
    )
}

export default ActivateSports
