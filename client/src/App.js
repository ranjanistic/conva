import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { get } from "./paths/get";
import setAuthToken from "./utils/setAuthToken";
import { setUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { useParams } from "react-router";
import AuthRoute from "./components/secure-route/AuthRoute";
import RoomRoute from "./components/secure-route/RoomRoute";
import MeetRoute from "./components/secure-route/MeetRoute";
import Dashboard from "./components/session/Dashboard";
import Account from "./components/session/Account";
import Room from "./components/session/Room";
import Meeting from "./components/session/Meeting";
import { isSessionValid } from "./actions/validator";
import { Key } from "./keys";
import "./App.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import { refer } from "./actions/requests";
import { ToastContainer } from "react-toastify";
// import {setCurrentTheme} from "./components/navbar"
// setCurrentTheme();
const sessionData = isSessionValid();
if (!sessionData) {
  store.dispatch(logoutUser());
} else {
  setAuthToken(localStorage.getItem(Key.sessionToken));
  store.dispatch(setUser(sessionData));
}

const Oauth = () => {
  let { token } = useParams();
  console.log(token);
  const currentTime = Date.now() / 1000;
  let decoded;
  try {
    decoded = jwt_decode(token);
    if (decoded.exp > currentTime) {
      localStorage.setItem(Key.sessionToken, token);
      setAuthToken(token);
      oauthSuccessView(decoded);
    } else throw Error("invalid");
  } catch (e) {
    return <h1>Invalid token {e}</h1>;
  }
};

const oauthSuccessView = (user) => {
  refer(get.auth.LOGIN);
  return (
    <h1>
      Logging in as {user.username}, {user.email}
    </h1>
  );
};

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path={get.ROOT} component={Landing} />
            <Route exact path={get.auth.SIGNUP} component={Register} />
            <Route exact path={get.auth.LOGIN} component={Login} />
            <Switch>
              <AuthRoute exact path={get.DASHBOARD} component={Dashboard} />
              <AuthRoute exact path={get.ACCOUNT} component={Account} />
              <RoomRoute path={get.room.self()} component={Room} />
              <MeetRoute path={get.meet.live()} component={Meeting} />
              <Route path={get.OAUTH.LOGIN} children={<Oauth />} />
            </Switch>
            <ToastContainer
              position="bottom-left"
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
