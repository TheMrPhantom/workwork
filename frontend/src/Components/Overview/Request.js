import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import RequestEntry from './RequestEntry';
import "./Request.css";
import { Typography } from '@material-ui/core';

const Request = ({headline}) => {
    return (
        <div className="request">
            <Typography variant="h6">{headline}</Typography>
            <TableContainer className="tableContainer" component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sparte</TableCell>
                            <TableCell>Was wurde getan?</TableCell>
                            <TableCell >Aufwand</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <RequestEntry sport="Agility" activity="Rasen mähen" duration="2h"/>
                        <RequestEntry sport="Rettungshunde" activity="Leitern streichen" duration="1h 30m"/>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Request
