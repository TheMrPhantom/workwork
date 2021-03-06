import { Button, TableCell, TableRow } from '@mui/material'
import React, { useState } from 'react'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { doPostRequest } from '../Common/StaticFunctions';

const MemberHistoryEntry = ({ sport, activity, duration, id, refresh }) => {

    const [disabled, setdisabled] = useState(false)

    const deleteItem = async () => {
        setdisabled(true)
        await doPostRequest("request/" + id + "/deny")
        setdisabled(false)
        refresh()
    }

    return (
        <TableRow>
            <TableCell > {sport}</TableCell>
            <TableCell >{activity}</TableCell>
            <TableCell >{duration}</TableCell>
            <TableCell align="right">
                <Button disabled={disabled} onClick={() => deleteItem()}>
                    <IndeterminateCheckBoxIcon className="denyBackground" />
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default MemberHistoryEntry
