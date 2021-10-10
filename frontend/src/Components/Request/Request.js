import { Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import AddWork from '../Sports/AddWork'

const Request = () => {
    return (
        <div>
           <Typography variant="h5">Anfrage Stellen</Typography>
            <Spacer vertical={10}/>
            <AddWork />    
        </div>
    )
}

export default Request
