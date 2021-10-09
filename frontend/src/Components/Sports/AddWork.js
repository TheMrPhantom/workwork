import React from 'react'
import "./Request.css"
import { Paper } from '@material-ui/core'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import Spacer from '../Common/Spacer';
import TextField from '@material-ui/core/TextField';
import "./AddWork.css"

const AddWork = () => {
    return (
        <Paper elevation={2} className="requestBox">
            <div className="outterFlex">
                <div className="innerFlex fullWidth">
                <TextField className="reasonBox" label="Begründung" type="input"/>
                <Spacer horizontal={10} />
                <TextField className="workTimeBox" label="Zeit in Minuten" type="number"/>
                </div>
                <Spacer horizontal={5} />
                <div>
                    <Button className="accept">
                        <AddBoxIcon />
                    </Button>
                </div>
            </div>
        </Paper>
    )
}

export default AddWork
