import { Checkbox, TableCell, TableRow } from '@material-ui/core'
import React from 'react'

import "./Settings.css"

const ActivateSportsEntry = ({ isParticipant, name }) => {
    return (
        <TableRow>
            <TableCell > <Checkbox defaultChecked={isParticipant} className="checkboxColor" /></TableCell>
            <TableCell >{name}</TableCell>
        </TableRow>
    )
}

export default ActivateSportsEntry
