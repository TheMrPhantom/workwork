import React, { useEffect, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Paper, Select } from '@material-ui/core'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox';
import Spacer from '../Common/Spacer';
import TextField from '@material-ui/core/TextField';
import { getAndStore } from '../Common/StaticFunctions';

import "./AddWork.css"
import "./Request.css"
const AddWork = () => {
    const [sportNames, setsportNames] = useState([])
    useEffect(() => {
        getAndStore("sports/names", setsportNames)
    }, [])
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
                            {sportNames.map((value) => { return <MenuItem value={value.id}>{value.name}</MenuItem> })}

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
