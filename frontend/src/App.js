import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router , Redirect} from 'react-router-dom';
import ClippedDrawer from "./Drawer.js"

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
  return (
    <div className="App">
      <Router>
      <Redirect to="/overview" />
        <MuiThemeProvider theme={theme}>
          <ClippedDrawer />
        </MuiThemeProvider>
      </Router>
    </div>
  );
}

export default App;
