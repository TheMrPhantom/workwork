import { TableCell, TableRow } from '@mui/material'
import React from 'react'
import GreenSwitch from '../Common/GreenSwitch'

import "./Settings.css"

const ActivateSportsEntry = ({ isParticipantMember, isParticipantTrainer, name, id, checkedChange }) => {
    return (
        <TableRow>
            <TableCell style={{ width: "100px" }}>
                <GreenSwitch checked={isParticipantMember} className="checkboxColor" onChange={(value) => { checkedChange("Teilnehmer", id, value.target.checked); }} />
            </TableCell>
            {isParticipantTrainer !== undefined ?
                <TableCell  >
                    <GreenSwitch checked={isParticipantTrainer} className="checkboxColor" onChange={(value) => { checkedChange("Trainer", id, value.target.checked); }} />
                </TableCell> :
                ""}
            <TableCell >{name}</TableCell>
        </TableRow>
    )
}

export default ActivateSportsEntry
