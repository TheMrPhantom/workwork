import React, { useEffect, useState } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import { Paper } from '@material-ui/core';
import MemberHistoryEntry from './MemberHistoryEntry';
import { getAndStore } from '../Common/StaticFunctions';

const MemberHistory = ({memberID}) => {
    const [workHours, setworkHours] = useState([])
    const [refresh, setrefresh] = useState(false)
    
    useEffect(() => {
        getAndStore("user/"+memberID+"/requests/accepted",setworkHours)
    }, [memberID,refresh])

    const doRefresh=()=>{
        setrefresh(!refresh)
    }

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
                {workHours.map((value)=><MemberHistoryEntry key={value.id} id={value.id} sport={value.sport} activity={value.activity} duration={value.duration + "h"} refresh={doRefresh}/>)}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default MemberHistory
