import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import ClippedDrawer from "./Drawer.js"
import { createContext } from 'react';

import './index.css';
import "./Components/Theme.css"

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#bbc34f'
      }
    }
  });

  var globalState = {
    userid: -1,
    token: ""
  };

  const globalStateContext = createContext(globalState)

  return (
    <div className="App">
      <globalStateContext.Provider value={globalState}>
        <Router>
          <Redirect to="/login" />
          <MuiThemeProvider theme={theme}>
            <ClippedDrawer />
          </MuiThemeProvider>
        </Router>
      </globalStateContext.Provider>
    </div>
  );
}

export default App;
