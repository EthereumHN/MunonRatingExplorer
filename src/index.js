import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from "react-router-dom";

function AppRouter() {
  return (
  <Router>
    <div>
      <Route path="/" exact component={App} />
    </div>
  </Router>
  );
}
  
  //ReactDOM.render(<App />, document.getElementById('root'));
  
  ReactDOM.render(
    AppRouter(),
    document.getElementById('root')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
