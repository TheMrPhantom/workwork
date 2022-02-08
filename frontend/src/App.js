import { ThemeProvider } from '@mui/material/styles';
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
          <ThemeProvider theme={theme}>
            <ClippedDrawer />
          </ThemeProvider >
        </Router>
      </globalStateContext.Provider>
    </div>
  );
}

export default App;
