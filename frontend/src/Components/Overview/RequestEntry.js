import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const RequestEntry = ({sport,activity,duration}) => {
    return (
        <TableRow>
            <TableCell > {sport}</TableCell>
            <TableCell >{activity}</TableCell>
            <TableCell >{duration}</TableCell>
        </TableRow>
    )
}

export default RequestEntry
