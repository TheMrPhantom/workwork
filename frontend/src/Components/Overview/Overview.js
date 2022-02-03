import { Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react'
import { getAndStore, getHoursFromMember } from '../Common/StaticFunctions';
import OverviewBox from './OverviewBox';
import PeopleWorkProgressChart from './PeopleWorkProgressChart';
import Request from './Request';
import Grid from '@mui/material/Grid';
import BadMemberOverview from './BadMemberOverview';
import BadMemberLineChart from './BadMemberLineChart';
import Spacer from '../Common/Spacer';
import UpcomingEventsList from './UpcomingEventsList';
import Constants from "../../environment.json";

const Overview = () => {

    const [memberState, setmemberState] = useState(0)
    const [sports, setsports] = useState([])
    const [members, setmembers] = useState([])
    const [membercount, setmembercount] = useState(0)
    const [trainercount, settrainercount] = useState(0)
    const [executivecount, setexecutivecount] = useState(0)
    const [notApprovedYet, setnotApprovedYet] = useState(0)
    const [maxWork, setmaxWork] = useState(0)
    const [currentWork, setcurrentWork] = useState(0)
    const [memberWorkStatus, setmemberWorkStatus] = useState([])
    const [trainerSports, settrainerSports] = useState([])
    const [events, setevents] = useState([])

    useEffect(() => {
        getAndStore("memberstate", setmemberState)
        getAndStore("sports/names", setsports)
        getAndStore("members", setmembers)
        getAndStore("work/request/pendingAmount", setnotApprovedYet)
        getAndStore("event", setevents)
    }, [])

    useEffect(() => {
        var membercount = 0;
        var trainercount = 0;
        var executivecount = 0;
        var maxWork = 0;
        var currentWork = 0;

        const hourCategories = [0, 0, 0, 0, 0, 0, 0, 0, 0]


        members.forEach(value => {
            membercount += 1;
            if (value.isTrainer) {
                trainercount += 1;
            }
            if (value.isExecutive) {
                executivecount += 1;
            }

            if (value.isTrainer || value.isExecutive) {
                return;
            }

            var hours = getHoursFromMember(value)
            currentWork += hours[0]
            maxWork += hours[1]

            var remainingHours = hours[1] - hours[0]
            var category = Math.min(Math.ceil((remainingHours) / 2), hourCategories.length - 1)
            var isInt = (remainingHours / 2) - Math.floor(remainingHours / 2) === 0

            if (isInt && category < hourCategories.length - 1 && category !== 0) {
                category += 1;
            }
            hourCategories[category] += 1
        })
        const memberWorkStatus = []
        var counter = 0
        hourCategories.forEach(value => {
            var tempHour = (counter * 2)
            if (counter === 0) {
                memberWorkStatus.push({ name: tempHour + "h", Mitglieder: value, amt: tempHour })
            } else if (counter < hourCategories.length - 1) {
                memberWorkStatus.push({ name: "<" + tempHour + "h", Mitglieder: value, amt: tempHour })
            } else {
                memberWorkStatus.push({ name: ">=" + (tempHour - 2) + "h", Mitglieder: value, amt: tempHour })
            }
            counter += 1
        })


        maxWork = maxWork - currentWork;

        setmembercount(membercount)
        settrainercount(trainercount)
        setexecutivecount(executivecount)
        setcurrentWork(currentWork)
        setmaxWork(maxWork)
        setmemberWorkStatus(memberWorkStatus)

    }, [members])

    useEffect(() => {
        if (memberState === 3) {
            getAndStore("sports/names/associated", settrainerSports)
        }
    }, [memberState])

    const trainerOrExecutiveView = useCallback((sport) => {
        return (<div>
            {memberState !== 3 ?
                <div style={{ display: 'flex', flexDirection: "row", flexWrap: "wrap" }}>
                    <Paper style={{ height: "280px", minWidth: "320px", maxWidth: "500px", width: "40%", padding: "10px", margin: "5px" }}>
                        <Typography variant="h6">Arbeitsstunden Übersicht</Typography>
                        <PeopleWorkProgressChart done={currentWork} needed={maxWork} />
                    </Paper>
                    <Paper style={{ height: "280px", minWidth: "320px", maxWidth: "500px", width: "40%", padding: "10px", margin: "5px" }}>
                        <Typography variant="h6">Offene Arbeitsstunden</Typography>
                        <BadMemberLineChart memberData={memberWorkStatus} />
                    </Paper>
                    <Grid container spacing={2} style={{ margin: "5px", minWidth: "320px", maxWidth: "500px", width: "40%" }} sx={{
                        '& .MuiGrid-item': {
                            padding: '5px',
                        },
                    }}>
                        <Grid item xs={6} >
                            <Paper style={{ padding: "10px", width: "100%", height: "100%" }}>
                                <Typography variant="h6">Mitglieder</Typography>
                                <Typography variant="h5">{membercount}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper style={{ padding: "10px", width: "100%", height: "100%" }}>
                                <Typography variant="h6">Trainer</Typography>
                                <Typography variant="h5">{trainercount}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper style={{ padding: "10px", width: "100%", height: "100%" }}>
                                <Typography variant="h6">Vorstände</Typography>
                                <Typography variant="h5">{executivecount}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper style={{ padding: "10px", width: "100%", height: "100%" }}>
                                <Typography variant="h6">Noch nicht genehmigt</Typography>
                                <Typography variant="h5">{notApprovedYet}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Spacer vertical={20} />

                </div > : ""}
            {memberState !== 3 ? <Spacer vertical={40} /> : ""}
            <Typography variant="h5">Mitglieder mit offenen Arbeitsstunden</Typography>
            <Spacer vertical={20} />
            {sport.map((value) => <BadMemberOverview key={value.id} sportID={value.id} sportName={value.name} />)}
        </div>)
    }, [currentWork, executivecount, maxWork, memberWorkStatus, membercount, notApprovedYet, trainercount, memberState])


    useEffect(() => {
        if (memberState === 3) {
            //Is trainer
            trainerOrExecutiveView(trainerSports)

        } else if (memberState === 5 || memberState === 7) {
            //Is Executive
            trainerOrExecutiveView(members)
        }
    }, [members, memberState, trainerOrExecutiveView, trainerSports])

    if (memberState === 3) {
        //Is trainer
        return trainerOrExecutiveView(trainerSports)

    } else if (memberState === 5 || memberState === 7) {
        //Is Executive
        return trainerOrExecutiveView(sports)
    }
    else if (memberState === 1) {
        //Is Member
        return (
            <div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <OverviewBox />
                    {window.innerWidth > Constants.COMPACT_SIZE_THRESHOLD ? <Spacer horizontal={20} /> : ""}
                    {events.length > 0 ? <UpcomingEventsList events={events} /> : ""}
                </div>
                <Request headline="Ausstehende Anfragen" requestName="requests/pending" />
                <Request headline="Genehmigte Anfragen" requestName="requests/accepted" />
            </div>
        )
    } else {
        return ""
    }
}

export default Overview