import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'
import { doPostRequest } from '../Common/StaticFunctions'
import ActivateSportsEntry from './ActivateSportsEntry'

const ActivateSports = ( { memberID,firstColumn, sportList, refresh}) => {
    console.log(sportList)
    const changeTrainerOrParticipation = async (id, checked) => {
        var output = null
        if (sportList===null){
            return
        }
        console.log(sportList)
        if (firstColumn === "Teilnehmer") {
            output = sportList.map((value) => {
                if (value.id === id) {
                    value.isParticipant = checked
                }
                return value
            })
            await doPostRequest("user/" + memberID + "/changeParticipation", output)
            
        } else {
            output = sportList.map((value) => {
                if (value.id === id) {
                    value.isTrainer = checked
                }
                return value
            })
            await doPostRequest("user/" + memberID + "/changeTrainer", output)
        }
        
        if (refresh!==null){
            refresh(true)
        }
    }

    return (
        <TableContainer className="tableContainer" component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{firstColumn}</TableCell>
                        <TableCell>Sparte</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {firstColumn === "Teilnehmer" ?
                        sportList.map((value) => {
                            return <ActivateSportsEntry key={value.id} isParticipant={value.isParticipant} name={value.name} id={value.id} checkedChange={changeTrainerOrParticipation} />
                        }) :
                        sportList.map((value) => {
                            return <ActivateSportsEntry key={value.id} isParticipant={value.isTrainer} name={value.name} id={value.id} checkedChange={changeTrainerOrParticipation} />
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ActivateSports
