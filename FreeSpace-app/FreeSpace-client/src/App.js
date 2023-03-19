import './App.css';
import {useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Login } from './components/authentication/login/Login';
import { Register } from './components/authentication/register/Register';
import { Dashboard } from './components/dashboard/Dashboard.js';
import { Menu } from './components/menu/Menu.js';
import { SenderListing } from './components/mySenderPosts/SenderListing';
import { CarrierListing } from './components/myCarrierPosts/CarrierListing';
import { SideBar } from './components/sideBar/SideBar.js';
import serverURL from './configVars';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Notification } from './components/notification/Notification';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [error] = useState(null)
  const [loggedInUserName, setLoggedInUserName] = useState(null)
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null)

  useEffect(() => {
    fetch(serverURL + 'auth/session', 
    {credentials: 'include'})
    .then(res => res.json())
    .then(res => setIsAuthenticated(res.isAuthenticated))
    .catch(err => console.log(err))

    fetch(serverURL , {
      credentials: 'include'
    })
    .then( response => {
      if (!response.ok){
        console.log(`custom error`);
        throw new Error(`There is some error!!`);
      }
      return response.json()})
    .then(jsonData => {
      console.log(jsonData)})
    .catch(err => {
      // setError(err.message);
    });
  }, [])
  return (
    <div className="App">
      {error && <div className="validationError m-4">{error}</div>}
      <Router>
        <Switch>
          <Route exact path = "/">
            {(!isAuthenticated && <Login setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>) || (<div><Menu /><Dashboard /></div>)}
          </Route>
          <Route exact path = "/login">
            <Login setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
          </Route>
          <Route exact path = "/register">
            <Register setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
          </Route>
          <Route exact path = "/dashboard">
            <Menu /><Dashboard setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
          </Route>
          <Route exact path = "/sender-listings">
            <Menu /><SenderListing setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
          </Route>
          <Route exact path = "/carrier-listings">
            <Menu /><CarrierListing setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
          </Route>
          <Route excat path="/sidebar">
            <SideBar loggedInUserEmail={loggedInUserEmail} loggedInUserName={loggedInUserName} setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
           </Route>
           <Route excat path="/termandcondition">
            <SideBar setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
           </Route>
           <Route excat path="/privacypolicy">
            <SideBar loggedInUserEmail={loggedInUserEmail} loggedInUserName={loggedInUserName}/>
           </Route>
           <Route exact path="/notification">
            <Menu /><Notification setLoggedInUserEmail={setLoggedInUserEmail} setLoggedInUserName={setLoggedInUserName}/>
          </Route>
          <Route path = "*">
            <h5>404 Page not Found</h5>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
