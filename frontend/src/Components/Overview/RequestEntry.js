import React from 'react'
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const RequestEntry = ({ sport, activity, duration }) => {
    return (
        <TableRow>
            <TableCell > {sport}</TableCell>
            <TableCell >{activity}</TableCell>
            <TableCell >{duration}</TableCell>
        </TableRow>
    )
}

export default RequestEntry
