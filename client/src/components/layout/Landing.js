import React, { Component } from "react";
import { Link } from "react-router-dom";
class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh", fontFamily: "Questrial" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b className="blue-text ">Conva</b>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Meetings made easy.
            </p>
            <br />
            <div className="col s6">
              <Link
                to="/register"
                className="btn btn-large waves-effect waves-light blue accent-3"
                style={{
                  borderRadius: "3px",
                  fontFamily: "Questrial",
                }}
              >
                Join Conva
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/login"
                className="btn btn-large waves-effect white-text"
                style={{
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;