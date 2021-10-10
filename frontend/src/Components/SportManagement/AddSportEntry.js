import { Button, TextField } from '@material-ui/core'
import React from 'react'
import Spacer from '../Common/Spacer'
import AddBoxIcon from '@material-ui/icons/AddBox';

const AddSportEntry = () => {
    return (
        <div className="outterAddBoxSport">
            <div className="innerBoxSport">
            <TextField label="Name" type="input"  />
                <Spacer horizontal={30}></Spacer>
                <TextField label="Extra Arbeitsstunden" type="number" defaultValue={0} />
            </div>
            <div>
                <Button >
                    <AddBoxIcon className="successBackground" />
                </Button>
            </div>
        </div>
    )
}

export default AddSportEntry
