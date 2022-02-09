import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#064663'
        },
        background: {
            default: "#041C32"
        },
        text: {
            primary: '#ECB365'
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                },
                outlined: {
                    borderColor: "#c8c8c8",
                    '&:hover': {
                        borderColor: '#989898'
                    }
                }
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#05223d"
                }
            }
        }, MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: "#ECB365"
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#05223d"
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    ":disabled": {
                        color: "#ECB365",
                    },

                    color: "red",
                    '&:focus': {
                        backgroundColor: '#989898'
                    }

                },
                '&:focus': {
                    backgroundColor: '#989898'
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    ":before": {
                        borderBottom: "1px solid #ECB365",

                    },
                }
            }
        }
    },
});

export const theme6 = createTheme({
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