import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {get} from "./paths/get";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
// import Oauth from "./components/auth/Oauth";
import { useParams } from "react-router";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Meeting from "./components/meeting/Meeting";
import {Key} from "./keys";
import "./App.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { refer } from "./actions/requests";

const token = localStorage.getItem(Key.sessionToken);
if (token) {
  let decoded;
  try{
    decoded = jwt_decode(token);
    setAuthToken(token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      refer(get.LOGIN);
    }
  }catch{
    store.dispatch(logoutUser());
    refer(get.LOGIN);
  }
}

const Oauth=()=>{
  let { token } = useParams();
  console.log(token);
  const currentTime = Date.now() / 1000;
  let decoded;
  try{
    decoded = jwt_decode(token);
    if(decoded.exp>currentTime){
      localStorage.setItem(Key.sessionToken, token);
      setAuthToken(token);
      return oauthSuccessView(decoded);
    } else throw Error("invalid");
  }catch(e){
    return <h1>Invalid token {e}</h1>
  }
}

const oauthSuccessView=(user)=>{
  refer(get.LOGIN);
  return (
    <h1>Logging in as {user.username}, {user.email}</h1>
  );
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path={get.ROOT} component={Landing} />
            <Route exact path={get.SIGNUP} component={Register} />
            <Route exact path={get.LOGIN} component={Login} />
            <Switch>
              <PrivateRoute exact path={get.DASHBOARD} component={Dashboard} />
              <PrivateRoute exact path={get.MEETING} component={Meeting} />
              <Route path={get.OAUTH.LOGIN} children={<Oauth />} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;