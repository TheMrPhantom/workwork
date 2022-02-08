import { Button } from '@mui/material';
import React, { useState } from 'react';
import { doPostRequest } from '../Common/StaticFunctions';
import Waiting from '../Common/Waiting';

const NotifyMembers = () => {

    const [sending, setsending] = useState(false);

    const buttonOnClick = async () => {
        setsending(true)
        await doPostRequest("settings/notify-members-open-workhours", {})
        setsending(false)
    }
    if (sending) {
        return <Waiting loadingText="Sende Mails, dies kann ein paar Minuten Dauern" />
    } else {
        return <Button variant='outlined' onClick={() => buttonOnClick()}>Mitglieder benachrichtigen</Button>;
    }
};

export default NotifyMembers;
