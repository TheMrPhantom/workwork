import React from 'react'
import { FormControl, InputLabel, MenuItem, Paper, Select } from '@material-ui/core'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import Spacer from '../Common/Spacer';
import TextField from '@material-ui/core/TextField';

import "./AddWork.css"
import "./Request.css"
const AddWork = () => {
    return (
        <Paper elevation={2} className="requestBox">
            <div className="outterFlex">
                <div className="innerFlex fullWidth">
                    <FormControl className="selectBox">
                        <InputLabel id="selectSportRequest-label">Sportart</InputLabel>
                        <Select
                            labelId="selectSportRequest-label"
                            id="selectSportRequest"
                            value={10}
                            label="sport"
                        >
                            <MenuItem value={10}>Agility</MenuItem>
                            <MenuItem value={20}>Rettungshunde</MenuItem>
                            <MenuItem value={30}>Obedience</MenuItem>
                        </Select>
                    </FormControl>
                    <Spacer horizontal={10} />
                    <TextField className="reasonBox" label="Begründung" type="input" />
                    <Spacer horizontal={10} />
                    <TextField className="workTimeBox" label="Zeit in Minuten" type="number" />
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
