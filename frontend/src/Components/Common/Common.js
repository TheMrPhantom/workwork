import { createTheme } from '@mui/material/styles';

const darkPrimary = "#064663"
const darkPrimaryLight = "#0b87c1"
const darkBackground = "#041C32"
const darkFont = "#ECB365"
const darkButtonFont = "#fafafa"
const darkButtonFontDark = "#0f0f0f"
const darkButtonFontDisabled = "#c0c0c0"
const darkButtonBorder = "#c8c8c8"
const darkButtonBorderHover = "#989898"
const darkPaperBackground = "#05223d"
const darkNotActive = "#989898"

export const theme = createTheme({
    palette: {
        primary: {
            main: darkPrimary
        },
        background: {
            default: darkBackground
        },
        text: {
            primary: darkFont
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: darkButtonFont,
                    ":disabled": {
                        color: darkButtonFontDisabled
                    }
                },
                outlined: {
                    borderColor: darkButtonBorder,
                    '&:hover': {
                        borderColor: darkButtonBorderHover
                    }
                }
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    "&.Mui-checked": {
                        color: darkButtonFontDark + "!important"
                    }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "&.Mui-focused fieldset": {
                        borderColor: darkButtonBorder + '!important',
                    }
                },
                notchedOutline: {
                    borderColor: darkButtonBorder,

                },
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: darkPaperBackground
                }
            }
        }, MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: darkFont
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: darkPaperBackground
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: darkButtonFont,
                    ":disabled": {
                        color: darkFont,
                    },
                },
            }
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    ":before": {
                        borderBottom: "1px solid " + darkFont,
                    },
                }
            }
        },
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    color: darkNotActive,
                }
            }
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    color: darkNotActive
                }
            }
        }, MuiToggleButton: {
            styleOverrides: {
                root: {
                    color: darkNotActive,
                    border: "1px solid " + darkNotActive
                }
            }
        }, MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: darkNotActive,
                    "&.Mui-focused": {
                        color: darkButtonBorder
                    }
                }
            }
        }, MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: darkPrimary
                }
            }
        }, MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    "&.Mui-checked": {
                        color: darkPrimaryLight
                    }
                }
            }
        }, MuiTypography: {
            styleOverrides: {
                root: {
                    color: darkFont + "!important"
                }
            }
        }
    },
});

export const theme4 = createTheme({
    palette: {
        primary: {
            main: '#bbc34f'
        },
        background: {
            default: "#fbfbfb"
        },
        text: {
            primary: '#000000'
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: '#000000',
                },
                outlined: {
                    borderColor: "#c8c8c8",
                    '&:hover': {
                        borderColor: '#989898'
                    }
                }
            },
        },
    },
});