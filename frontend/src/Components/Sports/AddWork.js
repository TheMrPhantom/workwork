import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@mui/material'
import Spacer from '../Common/Spacer';
import TextField from '@mui/material/TextField';
import { doPostRequest, getAndStore } from '../Common/StaticFunctions';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AskForTrainer from '../Request/AskForTrainer';
import Config from "../../environment.json";

import "./AddWork.css"
import "./Request.css"
import HSFAlert from '../Common/HSFAlert';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const AddWork = ({ memberID, refresh }) => {
    const [selectorValue, setselectorValue] = useState(-1)
    const [reason, setreason] = useState("")
    const [minutes, setminutes] = useState(0)
    const [sportNames, setsportNames] = useState([])
    const [canDisplayWarning, setcanDisplayWarning] = useState(false)
    const [dialogOpen, setdialogOpen] = useState(false)
    const steps = ['Sparte Auswählen', 'Tätigkeit', 'Arbeitsaufwand'];
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [open, setopen] = useState(false)
    const [message, setmessage] = useState("")
    const [messageOpen, setmessageOpen] = useState(false)
    const [useSelect, setuseSelect] = useState(false)

    var innerRef = useRef(null)
    var outterRef = useRef(null)

    useEffect(() => {
        getAndStore("sports/names/membership/" + memberID, (sports) => { setsportNames(sports); setcanDisplayWarning(true) })
    }, [memberID, refresh])

    const handleAlignment = (event, newAlignment) => {
        setselectorValue(newAlignment);
    };

    const addWork = async (trainer) => {
        if (selectorValue === -1 || selectorValue === null) {
            setmessage("Sportart auswählen")
            setopen(true)
            return
        }
        if (reason === "") {
            setmessage("Arbeit eintragen")
            setopen(true)
            return
        }
        if (minutes === 0) {
            setmessage("Mehr als 0 Minuten eintragen")
            setopen(true)
            return
        }
        if (selectorValue === 0 && trainer === undefined) {
            setdialogOpen(true)
            return
        }
        if (trainer == null) {
            await doPostRequest("request/create", { "memberID": memberID, "sportID": selectorValue, "description": reason, "minutes": minutes })
            setmessageOpen(true)
        } else {
            setdialogOpen(false)
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            await doPostRequest("request/create", { "memberID": memberID, "sportID": selectorValue, "description": reason, "minutes": minutes, "trainer": trainer })
            setmessageOpen(true)
        }
        setselectorValue(-1)
        setreason("")
        setminutes(0)
    }


    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        if (activeStep === 0) {
            if (selectorValue === -1 || selectorValue === null) {
                setmessage("Sportart auswählen")
                setopen(true)
                return
            }
        } else if (activeStep === 1) {
            if (reason === "") {
                setmessage("Arbeit eintragen")
                setopen(true)
                return
            }
        } else if (activeStep === 2) {
            if (minutes === 0) {
                setmessage("Mehr als 0 Minuten eintragen")
                setopen(true)
                return
            }
            if (selectorValue === 1) {
                setopen(false)
                setdialogOpen(true)
                return
            }
        }

        if (activeStep === steps.length - 1) {
            addWork()
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const addWorkNotPossible = () => {
        if (canDisplayWarning) {
            return <div className="sportWarning">Noch keinen Sportarten beigetreten (trage dich in den Einstellungen für Sparten ein)</div>
        } else {
            return ""
        }
    }


    const firstStep = () => {
        const refDefined = innerRef.current !== null && outterRef.current !== null;
        const canDisplayButtons = refDefined ? (innerRef.current.offsetWidth < outterRef.current.offsetWidth * 0.9) : true;

        if (refDefined && !canDisplayButtons && !useSelect) {
            setuseSelect(true)
        }

        if (!useSelect && (!refDefined || canDisplayButtons)) {
            return (<ToggleButtonGroup
                value={selectorValue}
                exclusive
                onChange={handleAlignment}
                ref={innerRef}
                aria-label="text alignment"
            >
                {
                    sportNames.map((value) => {
                        return (
                            <ToggleButton key={value.id} value={value.id} aria-label="left aligned" >
                                {value.name}
                            </ToggleButton>
                        )
                    })
                }
                <ToggleButton value={1} aria-label="left aligned" >
                    Andere Sparte
                </ToggleButton>

            </ToggleButtonGroup>
            )
        } else {
            return <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="sport-input-add-request-label">Sparte</InputLabel>
                <Select
                    labelId="sport-input-add-request-label"
                    id="sport-input-add-request"
                    value={selectorValue}
                    onChange={(value) => { setselectorValue(value.target.value) }}
                    style={{ minWidth: "200px" }}
                    label="Sparte"
                >
                    {
                        sportNames.map((value) => {
                            return (
                                <MenuItem key={value.id} value={value.id} aria-label="left aligned" >
                                    {value.name}
                                </MenuItem>
                            )
                        })
                    }
                    <MenuItem value={1} aria-label="left aligned" >
                        Andere Sparte
                    </MenuItem>
                </Select>
            </FormControl >
        }
    }



    const displayStep = () => {
        if (activeStep === 0) {
            return firstStep()
        } else if (activeStep === 1) {
            return <TextField variant="outlined" className="reasonBoxRequest" label="Begründung" type="input" value={reason} onChange={(value) => setreason(value.target.value)} />
        }
        else if (activeStep === 2) {
            return (
                <div className="outterAddWorkTimeFlex">
                    <div className="innerAddWorkTimeFlex">
                        <Typography variant="h6">Kurzauswahl</Typography>
                        <Spacer vertical={5} />
                        <Button onClick={() => setminutes(30)} variant="outlined" style={{ width: "100%" }}>Halbe Stunde</Button>
                        <Spacer vertical={5} />
                        <Button onClick={() => setminutes(60)} variant="outlined" style={{ width: "100%" }}>1 Stunde</Button>
                        <Spacer vertical={5} />
                        <Button onClick={() => setminutes(90)} variant="outlined" style={{ width: "100%" }}>1,5 Stunden</Button>
                        <Spacer vertical={5} />
                        <Button onClick={() => setminutes(120)} variant="outlined" style={{ width: "100%" }}>2 Stunden</Button>
                        <Spacer vertical={5} />
                        <Button onClick={() => setminutes(180)} variant="outlined" style={{ width: "100%" }}>3 Stunden</Button>
                        <Spacer vertical={5} />
                        <Button onClick={() => setminutes(240)} variant="outlined" style={{ width: "100%" }}>4 Stunden</Button>
                    </div>
                    <Spacer horizontal={50} vertical={30} />
                    <div className="innerAddWorkTimeFlex">
                        <Typography variant="h6">Aufwand</Typography>
                        <Spacer vertical={5} />
                        <TextField
                            variant="outlined"
                            className="workTimeBox"
                            label="Zeit in Minuten"
                            type="number"
                            value={minutes}
                            onChange={(value) => setminutes(value.target.value)}
                            style={{ width: "300px" }} />
                    </div>
                </div>
            )
        }
        return ""
    }

    return sportNames.length > 0 ? (
        <Box sx={{ width: '100%' }} ref={outterRef}>
            {window.innerWidth > Config.COMPACT_SIZE_THRESHOLD ?
                <Stepper style={{ backgroundColor: "transparent" }} activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant="caption">Optional</Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper> : ""}

            <AskForTrainer
                confirmText="Anfrage Stellen"
                addFunction={addWork}
                open={dialogOpen}
                setOpen={setdialogOpen}
            />
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Arbeitsstunde erfolgreich eingetragen
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Neue Arbeitsstunde eintragen</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Schritt {activeStep + 1}</Typography>
                    <Spacer vertical={20} />
                    {displayStep()}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Zurück
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Abenden' : 'Weiter'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
            <HSFAlert message={message} short="Bitte Felder korrekt ausfüllen" open={open} setOpen={setopen} />
            <HSFAlert
                type="success"
                message="Arbeisstunde erfolgreich erstellt"
                short="Ein Trainer wird sich deine Anfrage bald anschauen"
                open={messageOpen}
                setOpen={setmessageOpen}
                time={10000} />
        </Box>
    ) : addWorkNotPossible();
}

export default AddWork
