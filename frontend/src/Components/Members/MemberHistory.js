import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import { Paper } from '@material-ui/core';
import MemberHistoryEntry from './MemberHistoryEntry';

const MemberHistory = () => {
    return (
        <TableContainer className="tableContainer" component={Paper}>
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Sparte</TableCell>
                    <TableCell>Was wurde getan?</TableCell>
                    <TableCell >Aufwand</TableCell>
                    <TableCell align="right">Löschen</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <MemberHistoryEntry sport="Agility" activity="Rasen mähen" duration="12.5h"/>
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default MemberHistory
