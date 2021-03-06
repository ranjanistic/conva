import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "../../paths/get";
import { logoutUser } from "../../actions/authActions";

class Account extends Component {

  constructor(){
    super();
    
    this.state = {
      errors:{}
    }
  }

  render() {
    const {user} = this.props.auth;
    console.log(user)
    return (
      <div className="w3-row">
        <div className="w3-row w3-padding" style={{ height: "15vh" }}>
          <h4 className="w3-col w3-half">
            <Link to={get.DASHBOARD}>
              <span className="btn-flat waves-effect" title="Back to dashboard">
                <i className="material-icons">keyboard_backspace</i>
              </span>
            </Link>
            <span className="w3-padding-small">Your Account</span>
          </h4>
          <div className="w3-col w3-half">
            
          </div>
        </div>
        <div className="w3-row">
          <div className="w3-col w3-half w3-padding-small">
            <div className="w3-row slate w3-padding">

            </div>
          </div>
          <div className="w3-col w3-half w3-padding-small">
            <div className="w3-row slate w3-padding">
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps,{logoutUser})(Account);
