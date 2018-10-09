import React, { Component } from 'react';
import './App.css';
import Main from './containers/main'
import { AuthProvider } from './context/auth.context'
import CssBaseline from '@material-ui/core/CssBaseline'

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <AuthProvider>
          <Main />
        </AuthProvider>
      </React.Fragment>
    );
  }
}

export default App;
