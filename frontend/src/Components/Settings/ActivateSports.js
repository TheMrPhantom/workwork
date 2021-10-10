import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'
import ActivateSportsEntry from './ActivateSportsEntry'

const ActivateSports = () => {
    return (
        <TableContainer className="tableContainer" component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Teilnehmer</TableCell>
                            <TableCell>Sparte</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <ActivateSportsEntry isParticipant={true} name="Rettungshunde" />
                        <ActivateSportsEntry isParticipant={false} name="Obedience" />
                        <ActivateSportsEntry isParticipant={true} name="Agility" />
                    </TableBody>
                </Table>
            </TableContainer>
    )
}

export default ActivateSports
