import { Button, TableCell, TableRow } from '@material-ui/core'
import React from 'react'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

const MemberHistoryEntry = ({ sport, activity, duration }) => {
    return (
        <TableRow>
            <TableCell > {sport}</TableCell>
            <TableCell >{activity}</TableCell>
            <TableCell >{duration}</TableCell>
            <TableCell align="right">
                <Button >
                    <IndeterminateCheckBoxIcon className="denyBackground" />
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default MemberHistoryEntry
