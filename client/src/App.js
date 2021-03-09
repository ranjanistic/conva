import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { get } from "./paths/get";
import {setAuthToken} from "./utils/setAuthToken";
import { setUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Verification from "./components/auth/Verification";
import Recovery from "./components/auth/Recovery";
import AuthRoute from "./components/secure-route/AuthRoute";
import RoomRoute from "./components/secure-route/RoomRoute";
import MeetRoute from "./components/secure-route/MeetRoute";
import Dashboard from "./components/session/Dashboard";
import Account from "./components/session/Account";
import Room from "./components/session/Room";
import Meeting from "./components/session/Meeting";
import { useParams } from "react-router";
import { isSessionValid, sessionToken } from "./actions/validator";
import { Key } from "./keys";
import { refer } from "./actions/actions";
import { ToastContainer } from "react-toastify";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import "./fonts/Jost.css"
import "./fonts/Questrial.css"
import "./material-icons.css";
import "./w3.min.css";
import "./materialize.min.css";
import "./App.css";
// import {setCurrentTheme} from "./components/navbar"
// setCurrentTheme();
const sessionData = isSessionValid();
if (!sessionData) {
  store.dispatch(logoutUser());
} else {
  setAuthToken(sessionToken());
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
            <Route path={get.auth.signup()} component={Register} />
            <Route path={get.auth.login()} component={Login} />
            <Route exact path={get.auth.RECOVERY} component={Recovery} />
            <Switch>
              <AuthRoute exact path={get.DASHBOARD} component={Dashboard} />
              <AuthRoute exact path={get.ACCOUNT} component={Account} />
              <AuthRoute exact path={get.auth.VERIFY} component={Verification} />
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
