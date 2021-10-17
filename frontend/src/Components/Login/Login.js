import { Button, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import Spacer from '../Common/Spacer'
import { doPostRequest } from '../Common/StaticFunctions'

import "./Login.css"

const Login = ({redirect}) => {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const login = async () => {
        const resp = await doPostRequest("login", { username: username, password: password });
        if (resp.code === 200) {
            if (resp.content === null) {
                alert("Email oder Benutzername falsch")
                return
            }
            redirect()
        }else{
            alert("Email oder Benutzername falsch")
        }
    }

    return (
        <Paper elevation={2} className="loginBox padding">
            <Typography variant="h5">Login</Typography>
            <Spacer vertical={10} />
            <TextField className="reasonBox mail-login" label="E-Mail Adresse" type="input" onChange={(value) => { setusername(value.target.value) }} />
            <form className="loginBox" action="" noValidate autoComplete="off" onSubmit={(event) => { event.preventDefault(); login() }}>
                <Spacer vertical={20} />
                <TextField className="reasonBox pw-login" label="Passwort" type="password" onChange={(value) => { setpassword(value.target.value) }} />
            </form>
            <Spacer vertical={20} />
            <Button className="loginButton" onClick={() => login()}>Login</Button>

        </Paper>
    )
}

export default Login
