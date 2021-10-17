import { Typography } from '@material-ui/core'
import Cookies from 'js-cookie'
import React from 'react'
import Spacer from '../Common/Spacer'
import AddWork from '../Sports/AddWork'

const Request = ({ memberID }) => {
    return (
        <div>
            <Typography variant="h5">Anfrage Stellen</Typography>
            <Spacer vertical={10} />
            <AddWork memberID={memberID === undefined ? Cookies.get("memberID") : memberID} />
        </div>
    )
}

export default Request
