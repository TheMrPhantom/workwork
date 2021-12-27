import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: "var(--primaryColor)",
        '&:hover': {
            backgroundColor: alpha("#000000", theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
        color: "var(--secondaryColor)",
        '&:hover': {
            backgroundColor: alpha("#000000", theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: "var(--primaryColor)",
    },
}));

export default GreenSwitch
