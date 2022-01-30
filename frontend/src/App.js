import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import ClippedDrawer from "./Drawer.js"
import { createContext } from 'react';
import { theme } from "./Components/Common/Common"
import './index.css';
import "./Components/Theme.css"

function App() {

  var globalState = {
    userid: -1,
    token: ""
  };

  const globalStateContext = createContext(globalState)

  return (
    <div className="App">
      <globalStateContext.Provider value={globalState}>
        <Router>
          <MuiThemeProvider theme={theme}>
            <ClippedDrawer />
          </MuiThemeProvider>
        </Router>
      </globalStateContext.Provider>
    </div>
  );
}

export default App;
