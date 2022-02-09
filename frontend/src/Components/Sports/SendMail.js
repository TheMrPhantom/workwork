import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import "../Members/MemberEntry.css"
import { TextField } from '@mui/material';
import Spacer from '../Common/Spacer';
import { doPostRequest } from '../Common/StaticFunctions';
import { useState } from 'react';
import HSFAlert from '../Common/HSFAlert';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import "./Sport.css"

const SendMail = ({ headlineText, confirmText, sportID, successOpen }) => {

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const BootstrapDialogTitle = (props) => {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other} style={{ width: window.innerWidth * 0.8, maxWidth: "500px" }}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    };

    BootstrapDialogTitle.propTypes = {
        children: PropTypes.node,
        onClose: PropTypes.func.isRequired,
    };


    const [open, setOpen] = React.useState(false);
    const [messageOpen, setmessageOpen] = useState(false)
    const [errorMessge, seterrorMessge] = useState("")
    const [stateSubject, setstateSubject] = useState("")
    const [stateBody, setstateBody] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    var subject = stateSubject;
    var body = stateBody;


    const send = async () => {
        if (subject === "" || body === "") {
            setstateSubject(subject)
            setstateBody(body)
            if (subject === "") {
                seterrorMessge("Kein Betreff angegeben")
            } else {
                seterrorMessge("Kein Inhalt angegeben")
            }
            setmessageOpen(true)
            return
        }
        var resp = null;
        if (sportID === undefined) {
            resp = await doPostRequest("mail/mailToAll", { "subject": subject, "body": body })
        } else {
            resp = await doPostRequest("mail/mailToSport/" + sportID, { "subject": subject, "body": body })
        }
        if (resp.code === 200) {
            successOpen(true)
            setstateBody("")
            setstateSubject("")
            setOpen(false)
        } else {
            seterrorMessge("Etwas beim Senden ist schiefgelaufen. Fehlercode: " + resp.code)
            setmessageOpen(true)
        }
    }

    return (
        <div>
            <Button onClick={handleClickOpen}>
                <MailOutlineIcon />
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} >
                    {headlineText}
                </BootstrapDialogTitle>
                <DialogContent dividers className="dialogFlex">
                    <TextField defaultValue={stateSubject} className="reasonBox" label="Betreff" type="input" onChange={(value) => subject = value.target.value} />
                    <Spacer vertical={20} />
                    <TextField multiline defaultValue={stateBody} className="mailBox" label="Inhalt" onChange={(value) => body = value.target.value} minRows={8} variant="outlined" />
                </DialogContent>
                <DialogActions>
                    <Button className="outlinedAddButton" onClick={() => send()}>
                        {confirmText}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <HSFAlert message={errorMessge} short={"Bitte Felder ausfüllen"} open={messageOpen} setOpen={setmessageOpen} />
        </div>
    );
}

export default SendMail
