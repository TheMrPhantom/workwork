import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import RequestEntry from './RequestEntry';
import { Typography } from '@mui/material';
import { getAndStore } from '../Common/StaticFunctions';

import "./Request.css";
import Cookies from 'js-cookie';

const Request = ({ headline, requestName }) => {
    const [request, setrequest] = useState([])

    useEffect(() => {
        const memberID = Cookies.get("memberID")
        getAndStore("user/" + memberID + "/" + requestName, setrequest)
    }, [requestName]);

    if (request.length > 0) {
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
                            {request.map(value => <RequestEntry key={value.id} sport={value.sport} activity={value.activity} duration={value.duration + "h"} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    } else {
        return ""
    }
}

export default Request
