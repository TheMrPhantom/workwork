import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import ClippedDrawer from "./Drawer.js"
import { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { themes } from "./Components/Common/Common"
import './index.css';
import "./Components/Theme.css"

function App() {

  var globalState = {
    userid: -1,
    token: ""
  };
  const [themeCookie, setthemeCookie] = useState(0)

  useEffect(() => {
    setthemeCookie(Cookies.get("theme") !== undefined ? Cookies.get("theme") : 0)
  }, [])


  const globalStateContext = createContext(globalState)

  return (
    <ThemeProvider theme={themes[themeCookie]}>
      <div className="App">
        <globalStateContext.Provider value={globalState}>
          <Router>
            <ClippedDrawer />
          </Router>
        </globalStateContext.Provider>
      </div>
    </ThemeProvider >
  );
}

export default App;
