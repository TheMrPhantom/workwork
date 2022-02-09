import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#bbc34f'
        },
        buttons: {
            main: '#000000'
        }
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
        }
    },
});
