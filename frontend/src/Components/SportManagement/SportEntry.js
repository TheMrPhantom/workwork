import { Button, Paper, TextField, Typography } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';


import "./SportManagement.css"

const SportEntry = ({name,extraHours}) => {
    return (
        <Paper elevation={2} className="outterBoxSport">
            <div className="innerBoxSport">
                <Typography>{name}</Typography>
                <Spacer horizontal={30}></Spacer>
                <TextField label="Extra Arbeitsstunden" type="number" defaultValue={extraHours} />
            </div>
            <div>
                <Button >
                    <IndeterminateCheckBoxIcon className="denyBackground" />
                </Button>
            </div>
            
        </Paper>
    )
}

export default SportEntry
