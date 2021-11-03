import { Button, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import { doPostRequest } from '../Common/StaticFunctions'
import AddMember from '../Members/AddMember'
import HSFAlert from '../Common/HSFAlert'

import "./Login.css"

const Login = ({ redirect }) => {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [open, setopen] = useState(false)

    const login = async () => {
        const resp = await doPostRequest("login", { username: username, password: password });
        if (resp.code === 200) {
            if (resp.content === null) {
                setopen(true)
                return
            }
            redirect()
        } else {
            setopen(true)
        }
    }

    const boderType = () => {
        if (window.innerWidth < 600) {
            return "outlined"
        } else {
            return "contained"
        }
    }

    return (

        <Paper elevation={2} className="loginBox padding loginPic">

            <Typography variant="h5">Login</Typography>
            <Spacer vertical={10} />
            <TextField className="reasonBox mail-login" label="E-Mail Adresse" type="input" onChange={(value) => { setusername(value.target.value) }} />
            <form className="loginBox" action="" noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault(); login() }}>
                <Spacer vertical={20} />
                <TextField className="reasonBox pw-login" label="Passwort" type="password" onChange={(value) => { setpassword(value.target.value) }} />
            </form>
            <Spacer vertical={20} />
            <div className="verticalFloatLogin mail-login">
                <AddMember buttonText="Registrieren" headlineText="Registrieren" confirmText="Registrieren" />
                <Button variant={boderType()} className="loginButton" onClick={() => login()}>Login</Button>
            </div>
            <HSFAlert message="Benutzername oder Passwort falsch" short="Bitte erneut versuchen" open={open} setOpen={setopen}/>
        </Paper>


    )
}

export default Login
