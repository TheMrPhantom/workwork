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
import Spacer from '../Common/Spacer';
import { getAndStore } from '../Common/StaticFunctions';
import { Checkbox, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { theme } from "../Common/Common"

import "../Members/MemberEntry.css";

const AskForTrainer = ({ open, setOpen, addFunction }) => {

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


    const [trainer, settrainer] = useState([])
    const memberOfSport = new Set()

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        getAndStore("members/trainerOrExecutive", settrainer)
    }, [])

    const addMember = async () => {
        if (memberOfSport.size === 0) {
            setOpen(true)
            return
        }
        const selectedTrainersArray = []
        memberOfSport.forEach((value) => selectedTrainersArray.push(value))
        addFunction(selectedTrainersArray)
    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} >
                    Trainer wählen
                </BootstrapDialogTitle>
                <DialogContent dividers className="dialogFlex">
                    <Typography variant="subtitle1"><b>Bitte wähle mindestens einen Trainer</b></Typography>
                    <Spacer vertical={10} />
                    <div className="checkboxFlex">
                        {trainer.sort((c1, c2) => c1.firstname.localeCompare(c2.firstname)).map((value) => {
                            return (
                                <Paper key={value.id} className="checkboxPaper">
                                    <FormControlLabel control={<Checkbox sx={{
                                        '&.Mui-checked': {
                                            color: theme.palette.primary.contrastText,
                                        },
                                    }} />}
                                        label={value.firstname}
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
                        Anfrage Stellen
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default AskForTrainer
