import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'
import ActivateSportsEntry from './ActivateSportsEntry'

const ActivateSports = ({ firstColumn, sportList }) => {
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
                    sportList.map((value) => { return <ActivateSportsEntry isParticipant={value.isParticipant} name={value.name} /> }) : 
                    sportList.map((value) => { return <ActivateSportsEntry isParticipant={value.isTrainer} name={value.name} /> })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ActivateSports
