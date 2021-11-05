import React from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';


const HSFAlert = ({ message, type, short, open, setOpen, time }) => {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
console.log(time === undefined ? 5000 : time)
console.log(time)
    if (type === "success") {
        return (
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                autoHideDuration={time === undefined ? 5000 : time}
                onClose={handleClose}
                sx={{ width: '100%' }}>
                <Alert variant="outlined" severity="success" sx={{ minWidth: "300px", width: '40%', backgroundColor: "white" }}>
                    <AlertTitle>Erfolg</AlertTitle>
                    {message}{short !== undefined ? <strong> - {short}</strong> : ""}
                </Alert>
            </Snackbar>
        )
    } else {
        return (
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                autoHideDuration={time === undefined ? 5000 : time}
                onClose={handleClose}
                sx={{ width: '100%' }}>
                <Alert variant="outlined" severity="error" sx={{ minWidth: "300px", width: '40%', backgroundColor: "white" }}>
                    <AlertTitle>Fehler</AlertTitle>
                    {message}{short !== undefined ? <strong> - {short}</strong> : ""}
                </Alert>
            </Snackbar>
        )
    }
}

export default HSFAlert
