import React from 'react'
import Request from './Request'
import Member from './Member'
import { Typography } from '@material-ui/core'
import Spacer from '../Common/Spacer'

const Sports = (props) => {
    //console.log(props)
    //props.match.params.name -> To get the sports id
    return (
        <div>
            <Typography variant="h5">Anfragen</Typography>
            <Spacer vertical={10}/>
            <Request name="Alice" work="Rasen mähen auf dem Hundeplatz"/>
            <Request name= "Bob" work="Leitern Streichen"/>
            <Request name="Eve" work="Hürden putzen"/>
            <Spacer vertical={20}/>
            
            <Typography variant="h5">Mitglieder</Typography>
            <Spacer vertical={10}/>
            <Member name="Alice" currentWork="10" maxWork="14"/>
            <Member name="Bob" currentWork="8" maxWork="14"/>
            <Member name="Eve" currentWork="3" maxWork="14"/>
            <Member name="Charly" currentWork="9" maxWork="14"/>            
        </div>
    )
}

export default Sports
