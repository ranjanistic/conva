import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "../../paths/get";
import { Key } from "../../keys";
import "./../../meeting.css"

class Account extends Component {

  constructor(){
    super();
    this.state = {}
  }

  render() {
    return (
      <div className="w3-row">
        <h4 className="w3-padding">
        <Link to={get.DASHBOARD}>
            <span className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i>
            </span>
        </Link>
        <span className="w3-padding">Account</span>
        </h4>
      </div>
    );
  }
}

Account.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
});
export default connect(mapStateToProps)(Account);
