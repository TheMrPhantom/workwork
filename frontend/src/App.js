import './index.css';
import ClippedDrawer from "./Drawer.js"
import "./Components/Theme.css"

import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#bbc34f'
      }
    }
  });
  return (
    <div className="App">
      <Router>
        <MuiThemeProvider theme={theme}>
          <ClippedDrawer />
        </MuiThemeProvider>
      </Router>
    </div>
  );
}

export default App;
