import { Checkbox, TableCell, TableRow } from '@material-ui/core'
import React from 'react'

import "./Settings.css"

const ActivateSportsEntry = ({ isParticipant, name, id, checkedChange }) => {
    return (
        <TableRow>
            <TableCell > <Checkbox checked={isParticipant} className="checkboxColor" onChange={(value) => { checkedChange(id, value.target.checked); }} /></TableCell>
            <TableCell >{name}</TableCell>
        </TableRow>
    )
}

export default ActivateSportsEntry
