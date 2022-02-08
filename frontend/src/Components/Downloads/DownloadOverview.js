import React, { useState } from 'react'
import { downloadPDF } from '../Common/StaticFunctions'
import { Button, Typography } from '@mui/material'

import Spacer from '../Common/Spacer'
import Waiting from '../Common/Waiting';

const DownloadOverview = () => {
    const downloading = [{ ...useState(false) }, { ...useState(false) }]
    const buttonStyle = { width: "170px" }
    const downloadP = async (path, id) => {
        downloading[id][1](true)
        const resp = await downloadPDF(path)
        if (resp === 400) {
            //Something went wrong
        }
        downloading[id][1](false)
    }

    const displayPDFButton = (url, index) => {
        if (downloading[index][0]) {
            return <Button variant="outlined" disabled style={buttonStyle}>
                <Waiting />
            </Button>
        } else {
            return (<Button variant="outlined" onClick={() => downloadP(url, index)} style={buttonStyle}>
                Download (PDF)
            </Button>
            )
        }
    }

    return (
        <div>
            <Typography variant="h6">Mitgliederübersicht</Typography>
            <Spacer vertical={15} />
            <div style={{ display: "flex" }}>
                {displayPDFButton("report/members/pdf", 0)}
                <Spacer horizontal={20} />
                <Button disabled variant="outlined" onClick={() => alert("Noch keine Funktion")}>
                    Download (Excel)
                </Button>
            </div>
            <Spacer vertical={30} />
            <Typography variant="h6">Mitglieder mit offenen Arbeitsstunden</Typography>
            <Spacer vertical={15} />
            <div style={{ display: "flex" }}>
                {displayPDFButton("report/remainingWorkhours/pdf", 1)}
                <Spacer horizontal={20} />
                <Button disabled variant="outlined" onClick={() => alert("Noch keine Funktion")}>
                    Download (Excel)
                </Button>
            </div>
        </div>
    )
}

export default DownloadOverview
