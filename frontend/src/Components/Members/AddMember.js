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
import { doPostRequest } from '../Common/StaticFunctions';

const AddMember = ({ buttonText, headlineText, confirmText }) => {

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

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    var firstname = "";
    var lastname = "";
    var email = "";

    const addMember = async () => {
        if (firstname === "" || lastname === "" || email === "") {
            alert("Bitte alle Felder ausfüllen")
            return
        }

        handleClose()

        const resp = await doPostRequest("member/add", { firstname: firstname, lastname: lastname, email: email })
        if (resp.code === 200) {
            alert(resp.content)
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
                    <TextField className="reasonBox" label="Vorname" type="input" onChange={(value) => firstname = value.target.value} />
                    <Spacer horizontal={10} />
                    <TextField className="reasonBox" label="Nachname" type="input" onChange={(value) => lastname = value.target.value} />
                    <Spacer horizontal={10} />
                    <TextField className="reasonBox" label="Email-Adresse" type="input" onChange={(value) => email = value.target.value} />
                </DialogContent>
                <DialogActions>
                    <Button className="outlinedAddButton" onClick={() => addMember()}>
                        {confirmText}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default AddMember
