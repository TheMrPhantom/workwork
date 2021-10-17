import React, { useEffect, useState } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import RequestEntry from './RequestEntry';
import { Typography } from '@material-ui/core';
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
                            {request.map(value => <RequestEntry sport={value.sport} activity={value.activity} duration={value.duration + "h"} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }else{
        return ""
    }
}

export default Request
