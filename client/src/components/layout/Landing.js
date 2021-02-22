import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {get} from "./../../paths/get";

class Landing extends Component {
  getAuthHtml() {
      return this.props.auth.isAuthenticated?(
        <div>
          <h4>
            <b className="blue-text ">
            Hey {this.props.auth.user.username}
            </b>
          </h4>
          <p className="flow-text grey-text text-darken-1">
            You're signed in.
          </p>
          <br />
          <div className="col s6">
            <Link
              to={get.DASHBOARD}
              className="btn btn-large waves-effect waves-light blue accent-3"
              style={{
                borderRadius: "3px",
                fontFamily: "Questrial",
              }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      ):(
        <div>
          <h4>
            <b className="blue-text ">
            Conva
            </b>
          </h4>
          <p className="flow-text grey-text text-darken-1">
            Meetings made easy.
          </p>
          <br />
          <div className="col s6">
            <Link
              to={get.auth.SIGNUP}
              className="btn btn-large waves-effect waves-light blue accent-3"
              style={{
                borderRadius: "3px",
                fontFamily: "Questrial",
              }}
            >
            Signup
            </Link>
          </div>
          <div className="col s6">
            <Link
              to={get.auth.LOGIN}
              className="btn btn-large waves-effect white-text"
              style={{
                borderRadius: "3px",
                letterSpacing: "1.5px",
              }}
            >
            LogIn
            </Link>
          </div>
        </div>
      )
  }

  render() {
    let html = (
      <div
        style={{ height: "75vh", fontFamily: "Questrial" }}
        className="container valign-wrapper"
      >
        <div className="row">
        <div className="col s12 center-align">
          {this.getAuthHtml()}
        </div>
        </div>
      </div>
    );
    return html;
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
