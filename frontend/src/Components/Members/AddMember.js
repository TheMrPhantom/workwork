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
import "./MemberEntry.css"
import { TextField } from '@material-ui/core';
import Spacer from '../Common/Spacer';
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';
import { Checkbox, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import HSFAlert from '../Common/HSFAlert';

const AddMember = ({ buttonText, headlineText, confirmText, refresh, setRegistrationOpen }) => {

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
            <DialogTitle sx={{ m: 0, p: 2 }} {...other} >
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
    const [sportnames, setsportnames] = useState([])
    const memberOfSport = new Set()
    const [messageOpen, setmessageOpen] = useState(false)
    const [errorMessge, seterrorMessge] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        getAndStore("sports/names", setsportnames)
    }, [])

    var firstname = "";
    var lastname = "";
    var email = "";

    const addMember = async () => {
        if (firstname === "" || lastname === "" || email === "") {
            seterrorMessge("Bitte alle Felder ausfüllen")
            setmessageOpen(true)
            return
        }
        if (memberOfSport.size === 0) {
            seterrorMessge("Bitte mindestens eine Sportart auswählen")
            setmessageOpen(true)
            return
        }
        

        const lowercaseMail = email.toLocaleLowerCase()

        const resp = await doPostRequest("member/add", { firstname: firstname, lastname: lastname, email: lowercaseMail, membership: [...memberOfSport] })
        if (resp.code === 200) {
            if (refresh !== undefined) {
                refresh()
            }
            handleClose()
            setRegistrationOpen(true)
        } else if (resp.code === 409) {
            seterrorMessge("Email existiert bereits")
            setmessageOpen(true)
        }

    }

    return (
        <div>
            <Button className="outlinedAddButton" variant="outlined" onClick={handleClickOpen}>
                {buttonText}
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
                    <Typography variant="subtitle1"><b>Mitgliedsdaten</b></Typography>
                    <Spacer vertical={10} />
                    <TextField className="reasonBox" label="Vorname" type="input" onChange={(value) => firstname = value.target.value} />
                    <Spacer vertical={10} />
                    <TextField className="reasonBox" label="Nachname" type="input" onChange={(value) => lastname = value.target.value} />
                    <Spacer vertical={10} />
                    <TextField className="reasonBox" label="Email-Adresse" type="input" onChange={(value) => email = value.target.value} />
                    <Spacer vertical={20} />
                    <Typography variant="subtitle1"><b>Sparten zugehörigkeit</b></Typography>
                    <Spacer vertical={10} />
                    <div className="checkboxFlex">
                        {sportnames.sort((c1, c2) => c1.name.localeCompare(c2.name)).map((value) => {
                            if (value.id === 1) {
                                return ""
                            }
                            return (
                                <Paper key={value.id} className="checkboxPaper">
                                    <FormControlLabel control={<Checkbox />}
                                        label={value.name}
                                        className="checkboxFormControll"
                                        onChange={(checkvalue) => {
                                            const ischecked = checkvalue.target.value
                                            if (ischecked) {
                                                memberOfSport.add(value.id)
                                            } else {
                                                memberOfSport.delete(value.id)
                                            }
                                        }} />
                                </Paper>
                            )
                        })}
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button className="outlinedAddButton" onClick={() => addMember()}>
                        {confirmText}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <HSFAlert message={errorMessge} short={"Bitte Felder korrekt ausfüllen"} open={messageOpen} setOpen={setmessageOpen} />
        </div>
    );
}

export default AddMember
