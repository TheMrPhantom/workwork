import React, { useState } from 'react'
import { downloadPDF } from '../Common/StaticFunctions'
import { Button, Typography } from '@material-ui/core'
import CircularProgress from '@mui/material/CircularProgress';

import Spacer from '../Common/Spacer'

const DownloadOverview = () => {
    const [downloading, setdownloading] = useState(false)
    const buttonStyle = { width: "170px" }
    const downloadP = async (path) => {
        setdownloading(true)
        const resp = await downloadPDF(path)
        if (resp === 400) {
            //Something went wrong
        }
        setdownloading(false)
    }

    const displayPDFButton = (url) => {
        if (downloading) {
            return <Button variant="outlined" disabled style={buttonStyle}>
                <CircularProgress style={{ color: "var(--primaryColor)", width: "30px", height: "30px" }} />
            </Button>
        } else {
            return (<Button variant="outlined" onClick={() => downloadP(url)} style={buttonStyle}>
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
                {displayPDFButton("report/members/pdf")}
                <Spacer horizontal={20} />
                <Button disabled variant="outlined" onClick={() => alert("Noch keine Funktion")}>
                    Download (Excel)
                </Button>
            </div>
            <Spacer vertical={30} />
            <Typography variant="h6">Mitglieder mit offenen Arbeitsstunden</Typography>
            <Spacer vertical={15} />
            <div style={{ display: "flex" }}>
                {displayPDFButton("report/remainingWorkhours/pdf")}
                <Spacer horizontal={20} />
                <Button disabled variant="outlined" onClick={() => alert("Noch keine Funktion")}>
                    Download (Excel)
                </Button>
            </div>
        </div>
    )
}

export default DownloadOverview
