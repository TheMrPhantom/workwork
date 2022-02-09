import { createTheme } from '@mui/material/styles';

const darkPrimary = "#064663"
const darkBackground = "#041C32"
const darkFont = "#ECB365"
const darkButtonFont = "#fafafa"
const darkButtonFontDisabled = "#c0c0c0"
const darkButtonBorder = "#c8c8c8"
const darkButtonBorderHover = "#989898"
const darkPaperBackground = "#05223d"
const notActive = "#989898"

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
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: darkButtonBorder
                }
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
                    color: notActive,
                }
            }
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    color: notActive
                }
            }
        }, MuiToggleButton: {
            styleOverrides: {
                root: {
                    color: notActive,
                    border: "1px solid " + notActive
                }
            }
        }
    },
});

export const themez = createTheme({
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