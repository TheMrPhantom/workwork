import React from 'react';
import { Button } from '@mui/material'
import { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import Config from "../../environment.json";
import Spacer from '../Common/Spacer';
import { doPostRequest } from '../Common/StaticFunctions';

import "./SystemSettings.css"
import "../Common/Common.css"

const YearEndButton = () => {

    const [buttonPressed, setbuttonPressed] = useState(false)
    const [confirmText, setconfirmText] = useState("")


    const buttonOnClick = async () => {
        setbuttonPressed(!buttonPressed)
        if (confirmText === Config.YEAR_END_CONFIRM_TEXT.toUpperCase()) {
            doPostRequest("system/endyear", {})
            setconfirmText("")
        }
    }

    return <div>

        {
            buttonPressed ?
                <div className="flexContainerVertical">
                    <Typography variant="button" className="warningColor">Du bis im Begriff alle Arbeisstunden zu löschen! Wenn du dir sicher bist tippe:</Typography>
                    <Spacer vertical={10} />
                    <Typography className="warningColor" variant="overline">{Config.YEAR_END_CONFIRM_TEXT.toUpperCase()}</Typography>
                    <Spacer vertical={10} />
                    <TextField label="Bestätigung eingeben" value={confirmText} onChange={(value) => setconfirmText(value.target.value)}></TextField>
                    <Spacer vertical={20} />
                </div> : ""
        }
        <Button className="deleteMemberButton" onClick={() => buttonOnClick()}>Jahr abschließen</Button>

    </div>;
};

export default YearEndButton;
