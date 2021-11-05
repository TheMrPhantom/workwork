import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React, { useState } from 'react'
import HSFAlert from '../Common/HSFAlert'
import { doPostRequest } from '../Common/StaticFunctions'
import ActivateSportsEntry from './ActivateSportsEntry'

const ActivateSports = ({ memberID, firstColumn, sportList, refresh }) => {

    const [alertOpen, setalertOpen] = useState(false)

    const changeTrainerOrParticipation = async (id, checked) => {
        var output = null
        if (sportList === null) {
            return
        }
        if (firstColumn === "Teilnehmer") {
            output = sportList.map((value) => {
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
            output = sportList.map((value) => {
                if (value.id === id) {
                    value.isTrainer = checked
                }
                return value
            })
            const resp = await doPostRequest("user/" + memberID + "/changeTrainer", output)
            if (resp.code === 200) {
                setalertOpen(true)
            }
        }

        if (refresh !== null) {
            refresh(true)
        }
    }

    return (
        <TableContainer className="tableContainer" component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{firstColumn}</TableCell>
                        <TableCell>Sparte</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {firstColumn === "Teilnehmer" ?
                        sportList.map((value) => {
                            if (value.id === 1) {
                                return ""
                            }
                            return <ActivateSportsEntry key={value.id} isParticipant={value.isParticipant} name={value.name} id={value.id} checkedChange={changeTrainerOrParticipation} />
                        }) :
                        sportList.map((value) => {
                            if (value.id === 1) {
                                return ""
                            }
                            return <ActivateSportsEntry key={value.id} isParticipant={value.isTrainer} name={value.name} id={value.id} checkedChange={changeTrainerOrParticipation} />
                        })}
                </TableBody>
            </Table>
            <HSFAlert type="success" message="Gespeichert" open={alertOpen} setOpen={setalertOpen} />
        </TableContainer>
    )
}

export default ActivateSports
